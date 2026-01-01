import { Injectable } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';

@Injectable()
export class VisionService {
  private client = new ImageAnnotatorClient();

  async analyzeFood(imageBuffer: Buffer) {
    const [result] = await this.client.labelDetection({
      image: { content: imageBuffer },
    });

    return result.labelAnnotations;
  }
}
