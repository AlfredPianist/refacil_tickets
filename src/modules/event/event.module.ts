import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Buyer } from "../buyer/buyer.entity";
import { BuyerModule } from "../buyer/buyer.module";
import { BuyerService } from "../buyer/buyer.service";
import { Ticket } from "../ticket/ticket.entity";
import { EventController } from "./event.controller";
import { Event } from "./event.entity";
import { EventService } from "./event.service";

@Module({
  imports: [TypeOrmModule.forFeature([Event, Ticket, Buyer]), BuyerModule],
  providers: [EventService, BuyerService],
  controllers: [EventController],
  exports: [EventService],
})
export class EventModule {}
