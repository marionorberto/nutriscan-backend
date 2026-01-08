import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AIInput } from '../interfaces/ai-input.interface';
import { AIOutput } from '../interfaces/ai-output.interface';
import OpenAI from 'openai';
import { clinicalAnalysisPrompt } from '../prompts/ai-analysis.prompt';

@Injectable()
export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyze(input: AIInput): Promise<AIOutput> {
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

      return JSON.parse(content ?? '{}');
    } catch (error) {
      throw new InternalServerErrorException(
        'AI analysis failed' + error.message,
      );
    }
  }
}
