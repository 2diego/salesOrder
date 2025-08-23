import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Client } from './client.entity';
import { OrderItem } from './order-item.entity';
import { OrderLink } from './order-link.entity';
import { OrderValidation } from './order-validation.entity';

export enum OrderStatus {
  PENDING = 'pending',
  VALIDATED = 'validated',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'created_by' })
  createdById: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'delivery_date', type: 'date', nullable: true })
  deliveryDate: Date;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Client, client => client.orders)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];

  @OneToOne(() => OrderLink, orderLink => orderLink.order)
  orderLink: OrderLink;

  @OneToMany(() => OrderValidation, orderValidation => orderValidation.order)
  orderValidations: OrderValidation[];
}
