import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import _ from "lodash";
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

    const response = _.omit(
      { ...event, numberOfAvailableSeats, availableSeats },
      "tickets"
    );

    return response;
  }

  async showAvailableSeats(event: Event): Promise<Ticket[]> {
    const availableSeats = await this.ticketRepository
      .createQueryBuilder("ticket")
      .leftJoin(Event, "e")
      .select(["ticket.row", "ticket.column"])
      .where("ticket.buyer IS NULL")
      .getMany();
    return availableSeats;
  }

  async createEvent(attrs: Partial<Event>): Promise<{
    id: string;
    name: string;
    rows: number;
    columns: number;
    price: number;
    tickets: Ticket[];
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

  async updateEvent(id: string, attrs: Partial<Event>): Promise<Event> {
    const event = await this.eventRepository.preload({
      id,
      ...attrs,
    });
    if (event === undefined) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    // Recreate tickets according to update
    const previousMaxSeat = await this.ticketRepository.findOne({
      where: { event },
      order: { row: "DESC", column: "DESC" },
    });
    console.log(`last seat: ${previousMaxSeat}`);

    const previousMaxRow = previousMaxSeat.row.charCodeAt(0) - 64;
    const previousMaxColumn = previousMaxSeat.column;
    const newMaxRow = event.rows;
    const newMaxColumn = event.columns;

    let rowsArray = [];
    let columnsArray = [];

    if (previousMaxRow < newMaxRow) {
      rowsArray = Array.from(
        { length: newMaxRow - previousMaxRow },
        (_, count) => String.fromCharCode(previousMaxRow + count + 65)
      );
    } else {
      rowsArray = Array.from({ length: newMaxRow }, (_, count) =>
        String.fromCharCode(count + 65)
      );
      this.ticketRepository
        .createQueryBuilder("tickets")
        .delete()
        .from(Ticket)
        .where(`ticket.row > ${newMaxRow}`);
    }
    if (previousMaxColumn < newMaxColumn) {
      columnsArray = Array.from(
        { length: newMaxColumn - previousMaxColumn },
        (_, count) => previousMaxColumn + count + 1
      );
    } else {
      columnsArray = Array.from(
        { length: newMaxColumn },
        (_, count) => count + 1
      );
      this.ticketRepository
        .createQueryBuilder("tickets")
        .delete()
        .from(Ticket)
        .where(`ticket.column > ${newMaxColumn}`);
    }

    const ticketsArray = [];
    for (const row of rowsArray) {
      if (previousMaxRow <= newMaxRow && previousMaxColumn <= newMaxColumn)
        break;
      for (const column of columnsArray) {
        const ticket = this.ticketRepository.create({
          row,
          column,
          event,
        });
        ticketsArray.push(ticket);
      }
    }
    await this.ticketRepository.save(ticketsArray);
    await this.eventRepository.save(event);

    const response = {
      ...event,
      totalSeats: await this.ticketRepository.countBy({ event }),
    };
    return response;
  }

  async deleteEvent(id: string): Promise<Event> {
    const event = await this.eventRepository.findOneBy({ id });
    if (event === null) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return this.eventRepository.remove(event);
  }
}
