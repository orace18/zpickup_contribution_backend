import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WalletHistoryService } from './wallet-history.service';
import { CreateWalletHistoryDto } from './dto/create-wallet-history.dto';
import { UpdateWalletHistoryDto } from './dto/update-wallet-history.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('wallet-history')
export class WalletHistoryController {
  constructor(private readonly walletHistoryService: WalletHistoryService, ) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Historique des bonus reçus' })
  @ApiResponse({
    status: 200,
    description: "Retourne l'historique des transactions",
  })
  async getBonusHistory(@Param('userId') userId: string) {
    return this.walletHistoryService.getTransactionHistory(userId);
  }

  @Get('ambassador/:userId')
  @ApiOperation({ summary: 'Historique des transactions du portefeuille ambassadeur' })
  @ApiResponse({
    status: 200,
    description: "Retourne l'historique des transactions du portefeuille ambassadeur",
  })
  async getAmbassadorHistory(@Param('userId') userId: string) {
    return this.walletHistoryService.getTransactionHistory(userId, 'ambassador');
  }

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
