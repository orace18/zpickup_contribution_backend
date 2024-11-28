import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class DeductKilometersDto {
  @ApiProperty({ description: 'Number of kilometers to deduct' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  kilometers: number;

  @ApiProperty({ description: 'ID of the race' })
  @IsNotEmpty()
  @IsString()
  race_id: string;
}