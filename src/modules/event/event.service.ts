import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Ticket } from "../ticket/ticket.entity";
import { Event } from "./event.entity";

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>
  ) {}

  async listEvents(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async showEvent(id: string): Promise<{
    id: string;
    name: string;
    rows: number;
    columns: number;
    price: number;
    numberOfAvailableSeats: number;
    availableSeats: Ticket[];
  }> {
    const event = await this.eventRepository.findOneBy({ id });
    if (event === null) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    const availableSeats = await this.showAvailableSeats(event);
    const numberOfAvailableSeats = availableSeats.length;

    const response = { ...event, numberOfAvailableSeats, availableSeats };
    return response;
  }

  async showAvailableSeats(event: Event): Promise<Ticket[]> {
    const availableSeats = await this.ticketRepository.find({
      select: { row: true, column: true },
      where: { buyer: null, event },
    });
    return availableSeats;
  }

  async createEvent(attrs: Partial<Event>): Promise<{
    id: string;
    name: string;
    rows: number;
    columns: number;
    price: number;
    totalSeats: number;
  }> {
    const event = this.eventRepository.create(attrs);

    await this.eventRepository.save(event);
    const totalSeats = await this.createEventTickets(event);

    const response = { ...event, totalSeats };
    return response;
  }

  async createEventTickets(event: Event): Promise<number> {
    const rowsArray = Array.from({ length: event.columns }, (_, count) =>
      String.fromCharCode(count + 65)
    );
    const columnsArray = Array.from(
      { length: event.rows },
      (_, count) => count + 1
    );

    const ticketsArray = [];
    for (const row of rowsArray) {
      for (const column of columnsArray) {
        const ticket = this.ticketRepository.create({
          row,
          column,
          event,
        });
        ticketsArray.push(ticket);
      }
    }

    return (await this.ticketRepository.save(ticketsArray)).length;
  }

  async updateEvent(
    id: string,
    attrs: Partial<Event>
  ): Promise<{
    id: string;
    name: string;
    rows: number;
    columns: number;
    price: number;
    totalSeats: Promise<number>;
  }> {
    const event = await this.eventRepository.preload({
      id,
      ...attrs,
    });
    if (event === undefined) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    const totalSeats = this.updateEventTickets(event);
    await this.eventRepository.save(event);

    const response = { ...event, totalSeats };
    return response;
  }

  async updateEventTickets(event: Event): Promise<number> {
    const previousMaxSeat = await this.ticketRepository
      .createQueryBuilder("ticket")
      .innerJoin("event", "event", "ticket.event_id = event.id")
      .orderBy("ticket.row", "DESC")
      .addOrderBy("ticket.column", "DESC")
      .getOne();

    const previousMaxRow = previousMaxSeat.row.charCodeAt(0) - 64;
    const previousMaxColumn = previousMaxSeat.column;
    const newMaxRow = event.rows;
    const newMaxColumn = event.columns;

    const rowsArray = Array.from({ length: newMaxRow }, (_, count) =>
      String.fromCharCode(count + 65)
    );
    const columnsArray = Array.from(
      { length: newMaxColumn },
      (_, count) => count + 1
    );
    if (previousMaxRow >= newMaxRow) {
      this.ticketRepository
        .createQueryBuilder("ticket")
        .delete()
        .from(Ticket)
        .where("ticket.row > :row", {
          row: String.fromCharCode(newMaxRow + 64),
        })
        .execute();
    }
    if (previousMaxColumn >= newMaxColumn) {
      this.ticketRepository
        .createQueryBuilder("tickets")
        .delete()
        .from(Ticket)
        .where("ticket.column > :newMaxColumn", { newMaxColumn })
        .execute();
    }

    const ticketsArray = [];
    for (const row of rowsArray) {
      for (const column of columnsArray) {
        let ticket = await this.ticketRepository
          .createQueryBuilder("ticket")
          .innerJoin("event", "event", "ticket.event_id = event.id")
          .where("ticket.row = :row AND ticket.column = :column", {
            row,
            column,
          })
          .getOne();
        if (ticket === null) {
          ticket = this.ticketRepository.create({
            row,
            column,
            event,
          });
        }
        ticketsArray.push(ticket);
      }
    }

    return (await this.ticketRepository.save(ticketsArray)).length;
  }

  async deleteEvent(id: string): Promise<void> {
    const event = await this.eventRepository.findOneBy({ id });
    if (event === null) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    await this.eventRepository.remove(event);
  }
}
