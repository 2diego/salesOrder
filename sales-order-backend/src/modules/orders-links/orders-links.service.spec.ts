import { Test, TestingModule } from '@nestjs/testing';
import { OrdersLinksService } from './orders-links.service';

describe('OrdersLinksService', () => {
  let service: OrdersLinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersLinksService],
    }).compile();

    service = module.get<OrdersLinksService>(OrdersLinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
