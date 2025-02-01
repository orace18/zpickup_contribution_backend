import { Test, TestingModule } from '@nestjs/testing';
import { RaceHistoryService } from './race_history.service';

describe('RaceHistoryService', () => {
  let service: RaceHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RaceHistoryService],
    }).compile();

    service = module.get<RaceHistoryService>(RaceHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
