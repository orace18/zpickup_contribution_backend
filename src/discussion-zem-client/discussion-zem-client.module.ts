import { Module } from '@nestjs/common';
import { DiscussionZemClientService } from './discussion-zem-client.service';
import { DiscussionZemClientController } from './discussion-zem-client.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UsersModule } from 'src/users/users.module';
import { DiscussionZemClient, DiscussionZemClientSchema } from 'src/Schemas/discussion_zem_client/discussion_zem_client.schema';
import { DiscussionZemClientMessage, DiscussionZemClientMessageSchema } from 'src/Schemas/discussion_zem_client/discussion_zem_client_message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DiscussionZemClient.name, schema: DiscussionZemClientSchema },
      { name: DiscussionZemClientMessage.name, schema: DiscussionZemClientMessageSchema },
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
    UsersModule
  ],
  controllers: [DiscussionZemClientController],
  providers: [DiscussionZemClientService],
  exports: [DiscussionZemClientService]
})
export class DiscussionZemClientModule {}
