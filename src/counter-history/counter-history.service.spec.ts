import { Test, TestingModule } from '@nestjs/testing';
import { CounterHistoryService } from './counter-history.service';

describe('CounterHistoryService', () => {
  let service: CounterHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CounterHistoryService],
    }).compile();

    service = module.get<CounterHistoryService>(CounterHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
