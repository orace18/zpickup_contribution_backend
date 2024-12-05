import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards, Request,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WithdrawWalletDto } from './dto/withdraw-wallet.dto';

@ApiTags('wallet')
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance/:userId')
  @ApiOperation({ summary: 'Obtenir le solde du portefeuille' })
  @ApiResponse({
    status: 200,
    description: 'Retourne le solde du portefeuille',
  })
  async getBalance(@Param('userId') userId: string) {
    return this.walletService.getBalance(userId);
  }

  @Post('withdraw/:userId')
  @ApiOperation({ summary: "Retirer de l'argent du portefeuille" })
  @ApiResponse({ status: 200, description: 'Retrait effectué avec succès' })
  async withdraw(
    @Param('userId') userId: string,
    @Body() withdrawWalletDto: WithdrawWalletDto,
  ) {
    return this.walletService.withdraw(userId, withdrawWalletDto);
  }

  @Get('bonus-history/:userId')
  @ApiOperation({ summary: 'Historique des bonus reçus' })
  @ApiResponse({ status: 200, description: "Retourne l'historique des bonus" })
  async getBonusHistory(@Param('userId') userId: string) {
    return this.walletService.getBonusHistory(userId);
  }

  @Get('withdrawal-history/:userId')
  @ApiOperation({ summary: 'Historique des retraits' })
  @ApiResponse({
    status: 200,
    description: "Retourne l'historique des retraits",
  })
  async getWithdrawalHistory(@Param('userId') userId: string) {
    return this.walletService.getWithdrawalHistory(userId);
  }

  @Post()
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.create(createWalletDto);
  }

  @Get()
  findAll() {
    return this.walletService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletService.update(+id, updateWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletService.remove(+id);
  }
}
