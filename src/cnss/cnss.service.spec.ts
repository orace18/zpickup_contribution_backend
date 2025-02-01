import { Test, TestingModule } from '@nestjs/testing';
import { CnssService } from './cnss.service';

describe('CnssService', () => {
  let service: CnssService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CnssService],
    }).compile();

    service = module.get<CnssService>(CnssService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
