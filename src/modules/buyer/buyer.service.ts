import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "../event/event.entity";
import { EventService } from "../event/event.service";
import { Ticket } from "../ticket/ticket.entity";
import { Buyer } from "./buyer.entity";
import { CreateBuyerDto } from "./dtos/create-buyer.dto";

@Injectable()
export class BuyerService {
  constructor(
    @InjectRepository(Buyer)
    private readonly buyerRepository: Repository<Buyer>,

    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    private readonly eventService: EventService
  ) {}

  async showBuyer(id: string): Promise<Buyer> {
    const buyer = await this.buyerRepository.findOne({
      where: { id },
      relations: { tickets: true },
    });
    if (buyer === null) {
      throw new NotFoundException(`Buyer with id ${id} not found`);
    }
    return buyer;
  }

  async createBuyer(eventId: string, attrs: CreateBuyerDto): Promise<Buyer> {
    const { id, birthday, seats } = attrs;

    const event = await this.eventRepository.findOneBy({ id: eventId });
    if (event === null) {
      throw new NotFoundException(`Event with id ${eventId} not found`);
    }

    let buyer = await this.buyerRepository
      .createQueryBuilder("buyer")
      .innerJoin("ticket", "ticket", "ticket.buyer_id = buyer.id")
      .innerJoin("event", "event", "ticket.event_id = event.id")
      .where("event.id = :eventId AND buyer.id = :buyerId", {
        eventId: event.id,
        buyerId: id,
      })
      .getOne();
    if (buyer !== null) {
      throw new ConflictException(`Buyer with id ${id} already exists`);
    }

    const tickets = await this.buyTickets(event, seats);
    buyer = await this.buyerRepository.findOne({
      relations: { tickets: true },
      where: { id },
    });
    if (buyer !== null) {
      buyer.tickets = buyer.tickets.concat(tickets);
    } else {
      buyer = this.buyerRepository.create({ id, birthday, tickets });
    }
    return this.buyerRepository.save(buyer);
  }

  async buyTickets(event: Event, seats: Partial<Ticket>[]): Promise<Ticket[]> {
    const availableSeats = await this.eventService.showAvailableSeats(event);
    const selectedSeats = new Set<string>();
    for (const seat of seats) {
      const currentSeat = `${seat.row}${seat.column}`;

      if (selectedSeats.has(currentSeat)) {
        throw new BadRequestException(
          `Seat ${currentSeat} duplicated in seat selection.`
        );
      }
      selectedSeats.add(currentSeat);
    }

    let seatsChecked = 0;
    for (const seat of availableSeats) {
      const currentSeat = `${seat.row}${seat.column}`;
      if (seatsChecked === selectedSeats.size) break;
      if (selectedSeats.has(currentSeat)) {
        seatsChecked += 1;
        selectedSeats.delete(currentSeat);
        selectedSeats.add(`${currentSeat}X`);
      }
    }

    selectedSeats.forEach((seat) => {
      if (!seat.endsWith("X"))
        throw new BadRequestException(`Seat ${seat} already taken.`);
    });
    const boughtTickets: Ticket[] = [];
    for (const seat of seats) {
      const { row, column } = seat;
      const updatedTicket = await this.ticketRepository.findOneBy({
        row,
        column,
      });
      boughtTickets.push(updatedTicket);
    }

    return boughtTickets;
  }

  async deleteBuyer(id: string): Promise<Buyer> {
    const buyer = await this.buyerRepository.findOneBy({ id });
    if (buyer === null) {
      throw new NotFoundException(`Buyer with id ${id} not found`);
    }
    return this.buyerRepository.remove(buyer);
  }
}
