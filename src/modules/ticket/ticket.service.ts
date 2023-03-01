import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Ticket } from "./ticket.entity";

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>
  ) {}

  async listTickets(): Promise<Ticket[]> {
    return this.ticketRepository.find();
  }

  async showTicket(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOneBy({ id });
    if (ticket === null) {
      throw new NotFoundException(`Ticket with id ${id} not found`);
    }
    return ticket;
  }

  async createTicket(attrs: Partial<Ticket>): Promise<Ticket> {
    const ticket = this.ticketRepository.create(attrs);
    return this.ticketRepository.save(ticket);
  }

  async updateTicket(id: number, attrs: Partial<Ticket>): Promise<Ticket> {
    const ticket = await this.ticketRepository.preload({
      id,
      ...attrs,
    });
    if (ticket === undefined) {
      throw new NotFoundException(`Ticket with id ${id} not found`);
    }
    return this.ticketRepository.save(ticket);
  }

  async deleteTicket(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOneBy({ id });
    if (ticket === null) {
      throw new NotFoundException(`Ticket with id ${id} not found`);
    }
    return this.ticketRepository.remove(ticket);
  }
}
