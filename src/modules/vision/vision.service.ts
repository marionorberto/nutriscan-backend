import { Injectable } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';

import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class VisionService {
  private client = new ImageAnnotatorClient();

  constructor() {}

  async analyze(imageBuffer: Buffer) {
    try {
      const [result] = await this.client.labelDetection({
        image: { content: imageBuffer },
      });

      return result;
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(
        'AI analysis failed' + error.message,
      );
    }
  }
}
