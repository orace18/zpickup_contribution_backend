import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WithdrawWalletDto } from './dto/withdraw-wallet.dto';
import { TransactionType } from '../Schemas/wallet_schema/wallet_transaction.schema';
import { CreditWalletDto } from './dto/credit-wallet.dto';

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
    return this.walletService.getWalletBalance(userId);
  }

  @Post('credit/:userId')
  @ApiOperation({ summary: 'Crediter le portefeuille' })
  @ApiResponse({ status: 200, description: 'Recharge le portefeuille' })
  async credit(
    @Param('userId') userId: string,
    @Body() creditWalletDto: CreditWalletDto,
  ) {
    return this.walletService.creditWalletBalance(
      userId,
      creditWalletDto.transaction_type,
      creditWalletDto.amount,
    );
  }

  @Post('withdraw/:userId')
  @ApiOperation({ summary: "Retirer de l'argent du portefeuille" })
  @ApiResponse({ status: 200, description: 'Retrait effectué avec succès' })
  async withdraw(
    @Param('userId') userId: string,
    @Body() withdrawWalletDto: WithdrawWalletDto,
  ) {
    return this.walletService.withdrawWalletBalance(
      userId,
      withdrawWalletDto.amount,
      withdrawWalletDto.phone_number,
      TransactionType.WITHDRAWAL,
    );
  }

  @Post()
  create(@Body() createWalletDto: CreateWalletDto) {
    return "";
  }

  @Get()
  findAll() {
    return this.walletService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletService.findOne(+id);
  }

  @Patch('')
  update(@Body() creditWalletDto: CreditWalletDto) {
    return this.walletService.update(creditWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletService.remove(+id);
  }
}
