import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "../event/event.entity";
import { EventService } from "../event/event.service";
import { Ticket } from "../ticket/ticket.entity";
import { BuyerController } from "./buyer.controller";
import { Buyer } from "./buyer.entity";
import { BuyerService } from "./buyer.service";

@Module({
  imports: [TypeOrmModule.forFeature([Buyer, Event, Ticket])],
  providers: [BuyerService, EventService],
  controllers: [BuyerController],
  exports: [BuyerService]
})
export class BuyerModule {}
