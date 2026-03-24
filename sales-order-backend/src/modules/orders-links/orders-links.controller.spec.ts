import { Test, TestingModule } from '@nestjs/testing';
import { OrdersLinksController } from './orders-links.controller';

describe('OrdersLinksController', () => {
  let controller: OrdersLinksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersLinksController],
    }).compile();

    controller = module.get<OrdersLinksController>(OrdersLinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
