import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateCounterDto {
  @ApiProperty({ description: 'Kilometers traveled' })
  @IsOptional()
  @IsNumber()
  km_traveled?: number;

  @ApiProperty({ description: 'Counter balance' })
  @IsOptional()
  @IsNumber()
  balance?: number;
}
