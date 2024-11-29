import { Test, TestingModule } from '@nestjs/testing';
import { ActivationHistoryController } from './activation_history.controller';
import { ActivationHistoryService } from './activation_history.service';

describe('ActivationHistoryController', () => {
  let controller: ActivationHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivationHistoryController],
      providers: [ActivationHistoryService],
    }).compile();

    controller = module.get<ActivationHistoryController>(ActivationHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
