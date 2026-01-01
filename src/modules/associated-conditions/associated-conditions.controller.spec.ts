import { Test, TestingModule } from '@nestjs/testing';
import { AssociatedConditionsController } from './associated-conditions.controller';

describe('AssociatedConditionsController', () => {
  let controller: AssociatedConditionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssociatedConditionsController],
    }).compile();

    controller = module.get<AssociatedConditionsController>(
      AssociatedConditionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
