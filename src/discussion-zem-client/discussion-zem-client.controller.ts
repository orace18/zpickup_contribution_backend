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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DiscussionZemClientService } from './discussion-zem-client.service';
import { CreateDiscussionZemClientDto } from './dto/create-discussion-zem-client.dto';
import { UpdateDiscussionZemClientDto } from './dto/update-discussion-zem-client.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDiscussionZemClientMessageDto } from './dto/create-discussion-zem-client-message.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Controller('discussion-zem-client')
@UseGuards(JwtAuthGuard)
export class DiscussionZemClientController {
  constructor(
    private readonly discussionZemClientService: DiscussionZemClientService,
  ) {
    // Assurez-vous que les dossiers existent
    const dirs = ['uploads/images', 'uploads/audio', 'uploads/videos'];
    dirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  @Post()
  async createDiscussion(@Body() createDto: CreateDiscussionZemClientDto) {
    return this.discussionZemClientService.createDiscussion(createDto);
  }

  @Post('message')
  async addMessage(
    @Body() createMessageDto: CreateDiscussionZemClientMessageDto,
    @Req() req,
  ) {
    try {
      return this.discussionZemClientService.addMessage(
        createMessageDto,
        req.user.userId,
      );
    } catch (error) {
      console.error('Erreur dans le contrôleur addMessage:', error);
      throw error;
    }
  }

  // Upload d'image
  @Post('upload/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images/zem_client_chat',
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
      imageUrl: `/uploads/images/zem_client_chat/${file.filename}`,
      type: 'image',
    };
  }

  @Get('messages/:discussionId')
  async getMessages(@Param('discussionId') discussionId: string, @Req() req) {
    return this.discussionZemClientService.getDiscussionMessages(
      discussionId,
      req.user.userId,
    );
  }

  @Get('user-discussions')
  async getUserDiscussions(@Req() req) {
    return this.discussionZemClientService.getUserDiscussions(req.user.userId);
  }

  @Get()
  findAll() {
    return this.discussionZemClientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discussionZemClientService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiscussionZemClientDto: UpdateDiscussionZemClientDto,
  ) {
    return this.discussionZemClientService.update(
      +id,
      updateDiscussionZemClientDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discussionZemClientService.remove(+id);
  }
}
function uuidv4() {
  throw new Error('Function not implemented.');
}
