import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderValidationDto } from './create-order-validation-dto';

export class UpdateOrderValidationDto extends PartialType(CreateOrderValidationDto) {}