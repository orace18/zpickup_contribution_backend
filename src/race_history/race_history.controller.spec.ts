import { Test, TestingModule } from '@nestjs/testing';
import { RaceHistoryController } from './race_history.controller';
import { RaceHistoryService } from './race_history.service';

describe('RaceHistoryController', () => {
  let controller: RaceHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RaceHistoryController],
      providers: [RaceHistoryService],
    }).compile();

    controller = module.get<RaceHistoryController>(RaceHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
