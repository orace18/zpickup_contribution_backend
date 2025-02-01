import { Test, TestingModule } from '@nestjs/testing';
import { PenaltiesController } from './penalties.controller';
import { PenaltiesService } from './penalties.service';

describe('PenaltiesController', () => {
  let controller: PenaltiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PenaltiesController],
      providers: [PenaltiesService],
    }).compile();

    controller = module.get<PenaltiesController>(PenaltiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
