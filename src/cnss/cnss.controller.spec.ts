import { Test, TestingModule } from '@nestjs/testing';
import { CnssController } from './cnss.controller';
import { CnssService } from './cnss.service';

describe('CnssController', () => {
  let controller: CnssController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CnssController],
      providers: [CnssService],
    }).compile();

    controller = module.get<CnssController>(CnssController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
