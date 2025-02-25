import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceHistoryService } from './reference_history.service';

describe('ReferenceHistoryService', () => {
  let service: ReferenceHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferenceHistoryService],
    }).compile();

    service = module.get<ReferenceHistoryService>(ReferenceHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
