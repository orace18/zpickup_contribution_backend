import { Test, TestingModule } from '@nestjs/testing';
import { GSMNumberFormatService } from './gsmnumber-format.service';

describe('GsmnumberFormatService', () => {
  let service: GSMNumberFormatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GSMNumberFormatService],
    }).compile();

    service = module.get<GSMNumberFormatService>(GSMNumberFormatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
