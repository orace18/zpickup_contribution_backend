import { Test, TestingModule } from '@nestjs/testing';
import { ActivationHistoryService } from './activation_history.service';

describe('ActivationHistoryService', () => {
  let service: ActivationHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivationHistoryService],
    }).compile();

    service = module.get<ActivationHistoryService>(ActivationHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
