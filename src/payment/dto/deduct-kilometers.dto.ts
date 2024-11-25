import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class DeductKilometersDto {
  @ApiProperty({ description: 'Number of kilometers to deduct' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  kilometers: number;
}