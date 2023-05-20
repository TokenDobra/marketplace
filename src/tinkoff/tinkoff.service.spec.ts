import { Test, TestingModule } from '@nestjs/testing';
import { TinkoffService } from './tinkoff.service';

describe('TinkoffService', () => {
  let service: TinkoffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TinkoffService],
    }).compile();

    service = module.get<TinkoffService>(TinkoffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
