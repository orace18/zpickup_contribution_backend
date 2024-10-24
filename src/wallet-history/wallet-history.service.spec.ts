import { Test, TestingModule } from '@nestjs/testing';
import { WalletHistoryService } from './wallet-history.service';

describe('WalletHistoryService', () => {
  let service: WalletHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletHistoryService],
    }).compile();

    service = module.get<WalletHistoryService>(WalletHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
