import { Test, TestingModule } from '@nestjs/testing';
import { MedicationScheduleService } from './medication-schedules.service';

describe('MedicationScheduleService', () => {
  let service: MedicationScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicationScheduleService],
    }).compile();

    service = module.get<MedicationScheduleService>(MedicationScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
