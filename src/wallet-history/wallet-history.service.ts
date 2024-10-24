import { Injectable } from '@nestjs/common';
import { CreateWalletHistoryDto } from './dto/create-wallet-history.dto';
import { UpdateWalletHistoryDto } from './dto/update-wallet-history.dto';

@Injectable()
export class WalletHistoryService {
  create(createWalletHistoryDto: CreateWalletHistoryDto) {
    return 'This action adds a new walletHistory';
  }

  findAll() {
    return `This action returns all walletHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} walletHistory`;
  }

  update(id: number, updateWalletHistoryDto: UpdateWalletHistoryDto) {
    return `This action updates a #${id} walletHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} walletHistory`;
  }
}
