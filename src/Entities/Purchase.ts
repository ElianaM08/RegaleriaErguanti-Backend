import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";
import { Statistic } from "./Statistic";

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.purchases, { eager: true })
  @JoinColumn({ name: "userId" })
  user!: User;

  @ManyToOne(() => Product, (product) => product.purchases, { eager: true })
  @JoinColumn({ name: "productId" })
  product!: Product;

  @ManyToOne(() => Statistic, (statistic) => statistic.purchases, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "statisticId" })
  statistic!: Statistic | null;

  @Column({ type: "varchar", default: "purchase" })
  actionType!: string;

  @Column("int")
  quantity!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  totalPrice!: number;

  @CreateDateColumn()
  purchaseDate!: Date;
}
