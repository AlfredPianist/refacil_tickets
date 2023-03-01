import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Ticket } from "../ticket/ticket.entity";

@Entity()
export class Buyer {
  @PrimaryColumn()
  id: string;

  @Column({ type: "date" })
  birthday: string;

  @OneToMany(() => Ticket, (ticket) => ticket.buyer)
  tickets: Ticket[];
}
