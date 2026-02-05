import { Injectable, Logger } from '@nestjs/common';
import { refineFoodDataForDiabeticApp } from './utils/food-data-refiner';
import { createNutritionistPrompt } from './utils/nutritionist-prompt';
import OpenAI from 'openai';
import { Request } from 'express';
import { DiabeteProfilesService } from '@modules/diabeti-profiles/diabeti-profiles.service';

@Injectable()
export class NutritionAnalysisService {
  private readonly logger = new Logger(NutritionAnalysisService.name);
  private readonly openAiKey: string;
  private readonly openAiUrl = 'https://api.openai.com/v1/chat/completions';
  private openai: OpenAI;

  constructor(private readonly diabeteService: DiabeteProfilesService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzeFoodWithNutritionist(
    request: Request,
    apiResponse: any,
  ): Promise<any> {
    try {
      const { userId } = request['user'];

      // 1. Get userProfileData
      const profileUser = await this.diabeteService.gatherProfileData(userId);

      // 2. Refinar os dados da API
      const refinedData = refineFoodDataForDiabeticApp(apiResponse);

      // 3. Criar o prompt para o nutricionista AI
      const prompt = createNutritionistPrompt(profileUser, refinedData);

      // // 3. Chamar a API do OpenAI (ou outro modelo LLM)

      const analysis = await this.callNutritionistAI(prompt);

      return {
        ...refinedData,
        analysis,
      };
    } catch (error: any) {
      this.logger.error('Error analyzing food with nutritionist:', error);
    }
  }

  private async callNutritionistAI(prompt: string): Promise<any> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Você é um nutricionista especializado em diabetologia.' +
              'Analise os dados fornecidos e retorne APENAS um objeto JSON válido, sem nenhum texto adicional.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2, // Reduzido para mais consistência
        response_format: { type: 'json_object' }, // Força resposta em JSON
      });

      const aiResponse = response.choices[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      // Log para debug (remova em produção)
      this.logger.debug('AI Response raw:', aiResponse);

      try {
        // Tentar parse direto (já que usamos response_format: json_object)
        const parsedResponse = JSON.parse(aiResponse);

        // Validar estrutura básica do JSON
        if (
          !parsedResponse.analysisSummary ||
          !parsedResponse.finalMedicalVerdict
        ) {
          throw new Error('Invalid response structure from AI');
        }

        // Garantir que todos os campos necessários existam
        return this.validateAndCompleteAIResponse(parsedResponse);
      } catch (parseError) {
        this.logger.warn(
          'Failed to parse AI response as JSON, attempting fallback extraction:',
          parseError,
        );
        // Fallback: tentar extrair JSON da resposta
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Invalid AI response format - no JSON found');
        }

        try {
          const parsedResponse = JSON.parse(jsonMatch[0]);
          return this.validateAndCompleteAIResponse(parsedResponse);
        } catch (fallbackError) {
          this.logger.error('Failed to parse extracted JSON:', fallbackError);

          // Último fallback: retornar uma análise padrão de erro
          return this.generateFallbackAnalysis();
        }
      }
    } catch (error: any) {
      this.logger.error('Error calling nutritionist AI:', error);

      // Retornar análise de fallback em caso de erro total
      return this.generateFallbackAnalysis();
    }
  }

  private validateAndCompleteAIResponse(parsedResponse: any): any {
    // Garantir que a estrutura básica exista
    const defaultResponse = {
      analysisSummary: {
        overallSafetyStatus: 'YELLOW',
        totalCarbsScanned: 0,
        totalNetCarbsScanned: 0,
        totalCaloriesScanned: 0,
        mealBalance: 'UNBALANCED',
        diabeticSuitability: 'moderate',
        glycemicRisk: 'MEDIUM',
      },
      foodItemsEvaluated: [],
      finalMedicalVerdict: {
        isRecommended: false,
        title: 'Análise não concluída',
        reason: 'Não foi possível realizar a análise completa dos alimentos.',
        medicalSuggestion:
          'Consulte um nutricionista para avaliação detalhada.',
        suggestedPortion: 'Porção padrão',
        alternatives: [],
      },
      mealRecommendations: {
        insulinTiming: 'Consulte seu médico para orientações específicas',
        postMealMonitoring: 'Monitorar glicemia conforme orientação médica',
        exerciseSuggestion:
          'Atividade física regular ajuda no controle glicêmico',
      },
    };

    // Mesclar resposta do AI com defaults
    const mergedResponse = {
      ...defaultResponse,
      ...parsedResponse,
      analysisSummary: {
        ...defaultResponse.analysisSummary,
        ...(parsedResponse.analysisSummary || {}),
      },
      finalMedicalVerdict: {
        ...defaultResponse.finalMedicalVerdict,
        ...(parsedResponse.finalMedicalVerdict || {}),
      },
      mealRecommendations: {
        ...defaultResponse.mealRecommendations,
        ...(parsedResponse.mealRecommendations || {}),
      },
    };

    // Validar valores obrigatórios
    if (
      !['GREEN', 'YELLOW', 'RED'].includes(
        mergedResponse.analysisSummary.overallSafetyStatus,
      )
    ) {
      mergedResponse.analysisSummary.overallSafetyStatus = 'YELLOW';
    }

    if (
      !['LOW', 'MEDIUM', 'HIGH'].includes(
        mergedResponse.analysisSummary.glycemicRisk,
      )
    ) {
      mergedResponse.analysisSummary.glycemicRisk = 'MEDIUM';
    }

    // Garantir que arrays existam
    if (!Array.isArray(mergedResponse.foodItemsEvaluated)) {
      mergedResponse.foodItemsEvaluated = [];
    }

    if (!Array.isArray(mergedResponse.finalMedicalVerdict.alternatives)) {
      mergedResponse.finalMedicalVerdict.alternatives = [];
    }

    return mergedResponse;
  }

  private generateFallbackAnalysis(): any {
    return {
      analysisSummary: {
        overallSafetyStatus: 'YELLOW',
        totalCarbsScanned: 0,
        totalNetCarbsScanned: 0,
        totalCaloriesScanned: 0,
        mealBalance: 'UNBALANCED',
        diabeticSuitability: 'moderate',
        glycemicRisk: 'MEDIUM',
      },
      foodItemsEvaluated: [],
      finalMedicalVerdict: {
        isRecommended: false,
        title: 'Serviço Temporariamente Indisponível',
        reason:
          'Não foi possível conectar com o serviço de análise nutricional no momento.',
        medicalSuggestion:
          'Tente novamente em alguns minutos ou consulte as informações nutricionais disponíveis.',
        suggestedPortion: 'Consumir com moderação',
        alternatives: [
          'Opções com baixo índice glicêmico',
          'Alimentos ricos em fibras',
        ],
      },
      mealRecommendations: {
        insulinTiming: 'Siga sua rotina habitual de aplicação de insulina',
        postMealMonitoring:
          'É recomendado monitorar a glicemia 2 horas após a refeição',
        exerciseSuggestion:
          'Considerar caminhada leve após 30 minutos da refeição',
      },
      metadata: {
        isFallback: true,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
