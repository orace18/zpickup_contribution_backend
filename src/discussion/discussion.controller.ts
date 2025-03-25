import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DiscussionResponseDto } from './dto/discussion-response.dto';
import { CreateDiscussionMessageDto, DiscussionMessageResponseDto } from './dto/discussion-message.dto';
import { UpdateDiscussionStatusDto } from './dto/update-discussion-status.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';



@Controller('discussions')

export class DiscussionController {
  constructor(private readonly discussionService: DiscussionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createDiscussion(
    @Body() createDiscussionDto: CreateDiscussionDto,
    @Req() req,
  ): Promise<DiscussionResponseDto> {
    return this.discussionService.createDiscussion(
      createDiscussionDto,
      req.user.userId
    );
  }

  @Post('message')
  @UseGuards(JwtAuthGuard)
  async addMessageToDiscussion(
    @Body() createDiscussionMessageDto: CreateDiscussionMessageDto,
    @Req() req,
  ): Promise<DiscussionMessageResponseDto> {
    return this.discussionService.addMessageToDiscussion(createDiscussionMessageDto, req.user.userId );
  }


  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Dossier où stocker les images
      filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const ext = extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      }
    })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { imageUrl: `/uploads/${file.filename}` }; // Retourne l'URL de l'image
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllDiscussions(): Promise<DiscussionResponseDto[]> {
    return this.discussionService.getAllDiscussions();
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserDiscussions(@Param('userId') userId: string): Promise<DiscussionResponseDto[]> {
    return this.discussionService.getUserDiscussions(userId);
  }

  @Get(':id')
  async getDiscussion(@Param('id') id: string): Promise<DiscussionResponseDto> {
    return this.discussionService.getDiscussion(id);
  }

  @Get('messages/:id')
  @UseGuards(JwtAuthGuard)
  async getDiscussionMessages(@Param('id') discussionId: string) {
    return this.discussionService.getDiscussionMessages(discussionId);
  }

@Patch('status/:id')
    @UseGuards(JwtAuthGuard)
    async updateDiscussionStatus(
        @Param('id') id: string,
        @Body() updateStatusDto: UpdateDiscussionStatusDto
    ): Promise<DiscussionResponseDto> {
        return this.discussionService.updateDiscussionStatus(id, updateStatusDto.is_open);
    }
  

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteDiscussion(@Param('id') id: string): Promise<void> {
    return this.discussionService.deleteDiscussion(id);
  }

}