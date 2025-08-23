import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';

@Entity('order_links')
export class OrderLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ unique: true })
  token: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by' })
  createdById: number;

  // Relaciones
  @OneToOne(() => Order, order => order.orderLink)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => User, user => user.orderLinks)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;
}
