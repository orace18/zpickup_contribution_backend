import { Module } from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { DiscussionController } from './discussion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Discussion, DiscussionSchema } from 'src/Schemas/discussion_schema/discussion.schema';
import { DiscussionMessage, DiscussionMessageSchema } from 'src/Schemas/discussion_message/discussion_message.schema';
import { MulterModule } from '@nestjs/platform-express';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Discussion.name, schema: DiscussionSchema },
      { name: DiscussionMessage.name, schema: DiscussionMessageSchema },
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
    UsersModule
  ],
  controllers: [DiscussionController],
  providers: [DiscussionService],
  exports: [DiscussionService],
})
export class DiscussionModule {}
