import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderLinkDto } from './create-order-link-dto';

export class UpdateOrderLinkDto extends PartialType(CreateOrderLinkDto) {}