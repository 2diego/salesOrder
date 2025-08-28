import { Test, TestingModule } from '@nestjs/testing';
import { OrdersValidationsController } from './orders-validations.controller';

describe('OrdersValidationsController', () => {
  let controller: OrdersValidationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersValidationsController],
    }).compile();

    controller = module.get<OrdersValidationsController>(OrdersValidationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
