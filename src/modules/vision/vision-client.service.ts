import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { VisionLabel } from './interfaces/vision-label.interface';

@Injectable()
export class VisionClientService {
  private client: ImageAnnotatorClient;

  constructor() {
    this.client = new ImageAnnotatorClient();
  }

  async detectFoodLabels(imageBuffer: Buffer): Promise<VisionLabel[]> {
    try {
      const [result] = await this.client.labelDetection({
        image: { content: imageBuffer },
      });

      if (!result.labelAnnotations) return [];

      return result.labelAnnotations.map((label) => ({
        name: label.description ?? 'unknown',
        confidence: Number(label.score?.toFixed(2)),
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao comunicar com Cloud Vision' + error.message,
      );
    }
  }
}
