import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WalletHistoryService } from './wallet-history.service';
import { CreateWalletHistoryDto } from './dto/create-wallet-history.dto';
import { UpdateWalletHistoryDto } from './dto/update-wallet-history.dto';

@Controller('wallet-history')
export class WalletHistoryController {
  constructor(private readonly walletHistoryService: WalletHistoryService) {}

  @Post()
  create(@Body() createWalletHistoryDto: CreateWalletHistoryDto) {
    return this.walletHistoryService.create(createWalletHistoryDto);
  }

  @Get()
  findAll() {
    return this.walletHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletHistoryDto: UpdateWalletHistoryDto) {
    return this.walletHistoryService.update(+id, updateWalletHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletHistoryService.remove(+id);
  }
}
