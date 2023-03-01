import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ticket } from "../ticket/ticket.entity";
import { EventController } from "./event.controller";
import { Event } from "./event.entity";
import { EventService } from "./event.service";

@Module({
  imports: [TypeOrmModule.forFeature([Event, Ticket])],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
