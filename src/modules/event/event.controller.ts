import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { BuyerService } from "../buyer/buyer.service";
import { CreateBuyerDto } from "../buyer/dtos/create-buyer.dto";
import { CreateEventDto } from "./dtos/create-event.dto";
import { UpdateEventDto } from "./dtos/update-event.dto";
import { EventService } from "./event.service";

@Controller("events")
export class EventController {
  constructor(
    private eventService: EventService,
    private buyerService: BuyerService
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  listEvents() {
    return this.eventService.listEvents();
  }

  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  showEvent(@Param("id") id: string) {
    return this.eventService.showEvent(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createEvent(@Body() eventDto: CreateEventDto) {
    return this.eventService.createEvent(eventDto);
  }
  @Post("/:id/buy")
  @HttpCode(HttpStatus.CREATED)
  createBuyer(@Param("id") eventId: string, @Body() buyerDto: CreateBuyerDto) {
    return this.buyerService.createBuyer(eventId, buyerDto);
  }

  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  updateEvent(@Param("id") id: string, @Body() eventDto: UpdateEventDto) {
    return this.eventService.updateEvent(id, eventDto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteEvent(@Param("id") id: string) {
    return this.eventService.deleteEvent(id);
  }
}
