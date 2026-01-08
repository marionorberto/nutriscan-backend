import { Test, TestingModule } from '@nestjs/testing';
import { MedicationScheduleController } from './medication-schedules.controller';

describe('MedicationScheduleController', () => {
  let controller: MedicationScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicationScheduleController],
    }).compile();

    controller = module.get<MedicationScheduleController>(
      MedicationScheduleController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
