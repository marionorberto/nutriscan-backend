import { Injectable } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { VisionLabel } from './interfaces/vision-label.interface';
import { VisionClientService } from './vision-client.service';

import { InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { clinicalAnalysisPrompt } from '@modules/ai/prompts/ai-analysis.prompt';

@Injectable()
export class VisionService {
  private client = new ImageAnnotatorClient();
  private visionClientService: VisionClientService;

  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzeFood(imageBuffer: Buffer) {
    const [result] = await this.client.labelDetection({
      image: { content: imageBuffer },
    });

    console.log(result);

    const res = await this.analyzedByAi(result.labelAnnotations);

    return res;

    // return result.labelAnnotations;
  }

  async analyzedByAi(input: any): Promise<any> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: clinicalAnalysisPrompt(input),
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

  // orgazined code
  async analyzeImage(imageBuffer: Buffer): Promise<VisionLabel[]> {
    const labels = await this.visionClientService.detectFoodLabels(imageBuffer);

    // filtro simples para alimentos (POC)
    return labels.filter((label) => label.confidence >= 0.6);
  }
}
