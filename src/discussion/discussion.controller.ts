import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DiscussionResponseDto } from './dto/discussion-response.dto';
import {
  CreateDiscussionMessageDto,
  DiscussionMessageResponseDto,
} from './dto/discussion-message.dto';
import { UpdateDiscussionStatusDto } from './dto/update-discussion-status.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Controller('discussions')
export class DiscussionController {
  constructor(private readonly discussionService: DiscussionService) {
    // Assurez-vous que les dossiers existent
    const dirs = ['uploads/images', 'uploads/audio', 'uploads/videos'];
    dirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createDiscussion(
    @Body() createDiscussionDto: CreateDiscussionDto,
    @Req() req,
  ): Promise<DiscussionResponseDto> {
    return this.discussionService.createDiscussion(
      createDiscussionDto,
      req.user.userId,
    );
  }

  @Post('message')
  @UseGuards(JwtAuthGuard)
  async addMessageToDiscussion(
    @Body() createDiscussionMessageDto: CreateDiscussionMessageDto,
    @Req() req,
  ): Promise<DiscussionMessageResponseDto> {
    try {
      console.log('DTO reçu dans le contrôleur:', createDiscussionMessageDto);
      console.log('User ID:', req.user.userId);

      return await this.discussionService.addMessageToDiscussion(
        createDiscussionMessageDto,
        req.user.userId,
      );
    } catch (error) {
      console.error('Erreur dans le contrôleur addMessageToDiscussion:', error);
      throw error;
    }
  }

  // Upload d'image
  @Post('upload/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4();
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Vérifier que c'est bien une image
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|JPG)$/)) {
          return cb(new Error('Seules les images sont acceptées'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      imageUrl: `/uploads/images/${file.filename}`,
      type: 'image',
    };
  }

  // Upload audio
  @Post('upload/audio')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/audio',
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4();
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Vérifier que c'est bien un audio
        if (!file.mimetype.match(/\/(mp3|wav|ogg|aac|m4a|mp4)$/)) {
          return cb(new Error('Seuls les fichiers audio sont acceptés'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadAudio(@UploadedFile() file: Express.Multer.File) {
    return {
      mediaUrl: `/uploads/audio/${file.filename}`,
      mediaType: 'audio',
    };
  }

  // Upload vidéo
  @Post('upload/video')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/videos',
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4();
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Vérifier que c'est bien une vidéo
        if (!file.mimetype.match(/\/(mp4|webm|avi|mov|mkv)$/)) {
          return cb(new Error('Seuls les fichiers vidéo sont acceptés'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadVideo(@UploadedFile() file: Express.Multer.File) {
    return {
      mediaUrl: `/uploads/videos/${file.filename}`,
      mediaType: 'video',
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllDiscussions(): Promise<DiscussionResponseDto[]> {
    return this.discussionService.getAllDiscussions();
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserDiscussions(
    @Param('userId') userId: string,
  ): Promise<DiscussionResponseDto[]> {
    return this.discussionService.getUserDiscussions(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard) // Ajout de la protection de cette route
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
    @Body() updateStatusDto: UpdateDiscussionStatusDto,
  ): Promise<DiscussionResponseDto> {
    return this.discussionService.updateDiscussionStatus(
      id,
      updateStatusDto.is_open,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteDiscussion(@Param('id') id: string): Promise<void> {
    return this.discussionService.deleteDiscussion(id);
  }
}
