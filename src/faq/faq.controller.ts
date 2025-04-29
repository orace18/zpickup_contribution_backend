import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('faq')
@UseGuards(JwtAuthGuard)
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post('create-faq')
  createFAQ(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.createFAQ(createFaqDto);
  }

  @Get('all-faq')
  findAllFAQ() {
    return this.faqService.findAllFAQ();
  }

  @Patch('update-faq/:id')
  updateFAQ(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.updateFAQ(id, updateFaqDto);
  }

  @Get('by-faq-key/:faq_key')
  findByKey(@Param('faq_key') faq_key: string) {
    return this.faqService.findByKey(faq_key);
  }

 /* @Delete('delete-faq/:id')
  removeFAQ(@Param('id') id: string) {
    return this.faqService.removeFAQ(id);
  }*/

  @Delete('delete-faq/:id')
  @ApiResponse({ status: 200, description: 'FAQ supprimée avec succès' })
  @ApiResponse({ status: 400, description: 'Impossible de supprimer une FAQ système' })
  async removeFAQ(@Param('id') id: string) {
    try {
      return await this.faqService.removeFAQ(id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException('Erreur lors de la suppression de la FAQ', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
