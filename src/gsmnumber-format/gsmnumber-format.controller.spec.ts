import { Test, TestingModule } from '@nestjs/testing';
import { GSMNumberFormatController } from './gsmnumber-format.controller';
import { GSMNumberFormatService } from './gsmnumber-format.service';

describe('GsmnumberFormatController', () => {
  let controller: GSMNumberFormatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GSMNumberFormatController],
      providers: [GSMNumberFormatService],
    }).compile();

    controller = module.get<GSMNumberFormatController>(GSMNumberFormatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
