// ai/ai-analysis.service.ts
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiAnalysisService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async analyzeFood(data: any) {
    const prompt = `
You are a clinical nutrition assistant for diabetic patients.

Food: ${data.food}

Nutritional data:
${JSON.stringify(data.nutrition, null, 2)}

Clinical evaluation:
${JSON.stringify(data.clinicalResult, null, 2)}

Patient profile:
${JSON.stringify(data.patientProfile, null, 2)}

Return a JSON with:
- riskLevel
- canConsume (true/false)
- recommendedPortion
- warnings
- alternativeSuggestions
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    return JSON.parse(response.choices[0].message.content);
  }
}
