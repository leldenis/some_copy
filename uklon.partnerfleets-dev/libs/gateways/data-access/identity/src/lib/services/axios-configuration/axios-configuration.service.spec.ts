import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { AxiosConfigurationService } from './axios-configuration.service';

describe('AxiosConfigurationService', () => {
  let service: AxiosConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule.register({})],
      providers: [AxiosConfigurationService],
    }).compile();

    service = module.get<AxiosConfigurationService>(AxiosConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.todo('should log requests');

  describe('when modifying headers', () => {
    it.todo('should apply content-type header');
  });
});
