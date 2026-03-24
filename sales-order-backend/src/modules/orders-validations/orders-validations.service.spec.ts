import { Test, TestingModule } from '@nestjs/testing';
import { OrdersValidationsService } from './orders-validations.service';

describe('OrdersValidationsService', () => {
  let service: OrdersValidationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersValidationsService],
    }).compile();

    service = module.get<OrdersValidationsService>(OrdersValidationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
