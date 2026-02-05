import { Test, TestingModule } from '@nestjs/testing';
import { MealAnalysisService } from './meal-analysis.service';

describe('MealAnalysisService', () => {
  let service: MealAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MealAnalysisService],
    }).compile();

    service = module.get<MealAnalysisService>(MealAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
