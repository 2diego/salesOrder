import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { OrderLink } from './order-link.entity';
import { OrderValidation } from './order-validation.entity';

export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SELLER,
  })
  role: UserRole;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => Order, order => order.createdBy)
  orders: Order[];

  @OneToMany(() => OrderLink, orderLink => orderLink.createdBy)
  orderLinks: OrderLink[];

  @OneToMany(() => OrderValidation, orderValidation => orderValidation.validatedBy)
  orderValidations: OrderValidation[];
}
