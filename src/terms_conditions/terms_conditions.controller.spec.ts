import { Test, TestingModule } from '@nestjs/testing';
import { TermsConditionsController } from './terms_conditions.controller';
import { TermsConditionsService } from './terms_conditions.service';

describe('TermsConditionsController', () => {
  let controller: TermsConditionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TermsConditionsController],
      providers: [TermsConditionsService],
    }).compile();

    controller = module.get<TermsConditionsController>(TermsConditionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
