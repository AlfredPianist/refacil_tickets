import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Buyer } from "../buyer/buyer.entity";
import { Event } from "../event/event.entity";

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  row: string;

  @Column()
  column: number;

  @ManyToOne(() => Event, (event) => event.tickets)
  @JoinColumn({ name: "event_id" })
  event: Event;

  @ManyToOne(() => Buyer, (buyer) => buyer.tickets)
  @JoinColumn({ name: "buyer_id" })
  buyer: Buyer;
}
