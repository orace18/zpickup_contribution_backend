import { Test, TestingModule } from '@nestjs/testing';
import { DiscussionZemClientController } from './discussion-zem-client.controller';
import { DiscussionZemClientService } from './discussion-zem-client.service';

describe('DiscussionZemClientController', () => {
  let controller: DiscussionZemClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscussionZemClientController],
      providers: [DiscussionZemClientService],
    }).compile();

    controller = module.get<DiscussionZemClientController>(DiscussionZemClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
