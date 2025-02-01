import { Test, TestingModule } from '@nestjs/testing';
import { ZemsController } from './zems.controller';
import { ZemsService } from './zems.service';

describe('ZemsController', () => {
  let controller: ZemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZemsController],
      providers: [ZemsService],
    }).compile();

    controller = module.get<ZemsController>(ZemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
