import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';

@Entity('order_validations')
export class OrderValidation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'validated_by' })
  validatedById: number;

  @CreateDateColumn({ name: 'validated_at' })
  validatedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Relaciones
  @ManyToOne(() => Order, order => order.orderValidations)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => User, user => user.orderValidations)
  @JoinColumn({ name: 'validated_by' })
  validatedBy: User;
}
