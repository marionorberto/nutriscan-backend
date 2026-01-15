import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import {
  cleanFoodDataApiInfoPrompt,
  cleanImageInfoPrompt,
  finalResponsePrompt,
} from '../prompts/ai-analysis.prompt';

@Injectable()
export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // async analyze(input: AIInput): Promise<AIOutput> {
  //   try {
  //     const response = await this.openai.chat.completions.create({
  //       model: 'gpt-4o-mini',
  //       messages: [
  //         {
  //           role: 'user',
  //           content: clinicalAnalysisPrompt(input),
  //         },
  //       ],
  //       temperature: 0.3,
  //     });

  //     const content = response.choices[0].message.content;

  //     return JSON.parse(content ?? '{}');
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       'AI analysis failed' + error.message,
  //     );
  //   }
  // }

  async imageFromGCPDataCleaning(input: any): Promise<any> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: cleanImageInfoPrompt(input),
          },
        ],
        temperature: 0.3,
      });

      const content = response.choices[0].message.content;

      return this.extractJson(content);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(
        'AI analysis failed' + error.message,
      );
    }
  }

  async infoFromFoodDataApiCleaning(input: any): Promise<any> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: cleanFoodDataApiInfoPrompt(input),
          },
        ],
        temperature: 0.3,
      });

      const content = response.choices[0].message.content;

      return content;
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(
        'AI analysis failed' + error.message,
      );
    }
  }

  async prepareDataToFrontend(
    userProfileData: any,
    nutritionalInfoFromImage: any,
  ): Promise<any> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: finalResponsePrompt(
              userProfileData,
              nutritionalInfoFromImage,
            ),
          },
        ],
        temperature: 0.3,
      });

      const content = response.choices[0].message.content;

      return content;
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(
        'AI analysis failed' + error.message,
      );
    }
  }

  extractJson(content: string) {
    return JSON.parse(
      content
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim(),
    );
  }
}
