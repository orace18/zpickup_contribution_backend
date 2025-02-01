import { Test, TestingModule } from '@nestjs/testing';
import { CounterHistoryController } from './counter-history.controller';
import { CounterHistoryService } from './counter-history.service';

describe('CounterHistoryController', () => {
  let controller: CounterHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CounterHistoryController],
      providers: [CounterHistoryService],
    }).compile();

    controller = module.get<CounterHistoryController>(CounterHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
