import { Test, TestingModule } from '@nestjs/testing';
import { MealAnalysisController } from './meal-analysis.controller';

describe('MealAnalysisController', () => {
  let controller: MealAnalysisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealAnalysisController],
    }).compile();

    controller = module.get<MealAnalysisController>(MealAnalysisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
