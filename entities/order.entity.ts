import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./Cart.entity";

@Index("uq_order_cart_id", ["cartId"], { unique: true })
@Entity("order")
export class Order {
  @PrimaryGeneratedColumn({ type: "int", name: "order_id", unsigned: true })
  orderId: number;

  @Column( {
    type: "timestamp",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column( {
    type: "int",
    name: "cart_id",
    unique: true,
    unsigned: true,

  })
  cartId: number;

  @Column( {
    type: "enum",
    name: "status",
    enum: ["rejected", "accepted", "shiped", "pending"],
    default: () => "'pending'",
  })
  status: "rejected" | "accepted" | "shiped" | "pending";

  @OneToOne(() => Cart, (cart) => cart.order, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "cart_id", referencedColumnName: "cartId" }])
  cart: Cart;
}
