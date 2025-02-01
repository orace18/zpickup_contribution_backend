import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceHistoryController } from './reference_history.controller';
import { ReferenceHistoryService } from './reference_history.service';

describe('ReferenceHistoryController', () => {
  let controller: ReferenceHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferenceHistoryController],
      providers: [ReferenceHistoryService],
    }).compile();

    controller = module.get<ReferenceHistoryController>(ReferenceHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
