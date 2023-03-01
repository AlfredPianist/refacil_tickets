import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Buyer } from "./buyer.entity";

@Injectable()
export class BuyerService {
  constructor(
    @InjectRepository(Buyer)
    private readonly buyerRepository: Repository<Buyer>
  ) {}

  async listBuyers(): Promise<Buyer[]> {
    return this.buyerRepository.find();
  }

  async showBuyer(id: string): Promise<Buyer> {
    const buyer = await this.buyerRepository.findOneBy({ id });
    if (buyer === null) {
      throw new NotFoundException(`Buyer with id ${id} not found`);
    }
    return buyer;
  }

  async createBuyer(attrs: Partial<Buyer>): Promise<Buyer> {
    const buyer = this.buyerRepository.create(attrs);
    return this.buyerRepository.save(buyer);
  }

  async updateBuyer(id: string, attrs: Partial<Buyer>): Promise<Buyer> {
    const buyer = await this.buyerRepository.preload({
      id,
      ...attrs,
    });
    if (buyer === undefined) {
      throw new NotFoundException(`Buyer with id ${id} not found`);
    }
    return this.buyerRepository.save(buyer);
  }

  async deleteBuyer(id: string): Promise<Buyer> {
    const buyer = await this.buyerRepository.findOneBy({ id });
    if (buyer === null) {
      throw new NotFoundException(`Buyer with id ${id} not found`);
    }
    return this.buyerRepository.remove(buyer);
  }
}
