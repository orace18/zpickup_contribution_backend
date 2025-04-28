import { Test, TestingModule } from '@nestjs/testing';
import { DiscussionZemClientService } from './discussion-zem-client.service';

describe('DiscussionZemClientService', () => {
  let service: DiscussionZemClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscussionZemClientService],
    }).compile();

    service = module.get<DiscussionZemClientService>(DiscussionZemClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
