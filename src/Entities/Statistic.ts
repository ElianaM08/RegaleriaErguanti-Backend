import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from "typeorm";
import { User } from "./User";
import { Purchase } from "./Purchase";

@Entity()
export class Statistic {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.statistics, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  totalInvested!: number;

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  totalSold!: number;

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  totalProfit!: number;

  @Column({ type: "int", default: 0 })
  totalTransactions!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Purchase, (purchase) => purchase.statistic)
  purchases!: Purchase[];
}
