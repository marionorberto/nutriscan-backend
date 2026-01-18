import { Test, TestingModule } from '@nestjs/testing';
import { profilesController } from './profiles.controller';

describe('profilesController', () => {
  let controller: profilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [profilesController],
    }).compile();

    controller = module.get<profilesController>(profilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
