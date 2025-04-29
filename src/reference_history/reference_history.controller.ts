import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReferenceHistoryService } from './reference_history.service';
import { CreateReferenceHistoryDto } from './dto/create-reference_history.dto';
import { UpdateReferenceHistoryDto } from './dto/update-reference_history.dto';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller('reference-history')
export class ReferenceHistoryController {
  constructor(
    private readonly referenceHistoryService: ReferenceHistoryService,
  ) {}

  @Post()
  create(@Body() createReferenceHistoryDto: CreateReferenceHistoryDto) {
    return this.referenceHistoryService.create();
  }

  @Get()
  async findAll() {
    return this.referenceHistoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.referenceHistoryService.findOne(parseInt(id));
  }

  @Get('referrer/:id')
  async findByReferrer(@Param('id') id: string) {
    return await this.referenceHistoryService.findByReferrerWithDetails(id);
  }

  @Get('referral-stats/:id')
  async getReferralStats(@Param('id') id: string) {
    return this.referenceHistoryService.getReferralStats(id);
  }

  @Get('ambassador-referrals/:referrerId')
  @ApiOperation({
    summary: "Obtenir les détails des affiliés d'un ambassadeur",
  })
  @ApiResponse({
    status: 200,
    description: 'Retourne la liste des affiliés avec leurs statistiques',
  })
  async getAmbassadorReferrals(@Param('referrerId') referrerId: string) {
    return this.referenceHistoryService.getReferralDetails(referrerId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReferenceHistoryDto: UpdateReferenceHistoryDto,
  ) {
    return this.referenceHistoryService.update(
      parseInt(id),
      updateReferenceHistoryDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.referenceHistoryService.remove(parseInt(id));
  }
}
