import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DiscussionResponseDto } from './dto/discussion-response.dto';
import { IUser } from 'src/users/interface/user.interface';
import { User } from 'src/users/decorator/user.decorator';
import { CreateDiscussionMessageDto, DiscussionMessageResponseDto } from './dto/discussion-message.dto';



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
  

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteDiscussion(@Param('id') id: string): Promise<void> {
    return this.discussionService.deleteDiscussion(id);
  }

}