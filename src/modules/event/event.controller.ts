import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post
} from "@nestjs/common";
import { CreateEventDto } from "./dtos/create-event.dto";
import { UpdateEventDto } from "./dtos/update-event.dto";
import { EventService } from "./event.service";

@Controller("events")
export class EventController {
  constructor(private eventService: EventService) {}

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
