import { Test, TestingModule } from '@nestjs/testing';
import { ZemsService } from './zems.service';

describe('ZemsService', () => {
  let service: ZemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZemsService],
    }).compile();

    service = module.get<ZemsService>(ZemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
