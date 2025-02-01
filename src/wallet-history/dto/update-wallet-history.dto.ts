import { PartialType } from '@nestjs/mapped-types';
import { CreateWalletHistoryDto } from './create-wallet-history.dto';

export class UpdateWalletHistoryDto extends PartialType(CreateWalletHistoryDto) {}
