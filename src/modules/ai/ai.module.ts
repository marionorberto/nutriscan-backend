import { Module } from '@nestjs/common';
import { AIService } from './services/ai.service';

@Module({
  providers: [AIService],
  exports: [AIService],
})
export class AIModule {}
