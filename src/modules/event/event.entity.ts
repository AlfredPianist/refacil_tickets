import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Ticket } from "../ticket/ticket.entity";

@Entity()
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  rows: number;

  @Column()
  columns: number;

  @Column()
  price: number;

  @OneToMany(() => Ticket, (ticket) => ticket.event)
  tickets: Ticket[];
}
