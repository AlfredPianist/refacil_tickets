import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from "@nestjs/common";
import { CreateEventDto } from "./dtos/create-event.dto";
import { UpdateEventDto } from "./dtos/update-event.dto";
import { EventService } from "./event.service";

@Controller("event")
export class EventController {
  constructor(private eventService: EventService) {}

  @Get()
  listEvents() {
    return this.eventService.listEvents();
  }

  @Get("/:id")
  showEvent(@Param("id") id: string) {
    return this.eventService.showEvent(id);
  }

  @Post()
  createEvent(@Body() eventDto: CreateEventDto) {
    return this.eventService.createEvent(eventDto);
  }

  @Patch("/:id")
  updateEvent(@Param("id") id: string, @Body() eventDto: UpdateEventDto) {
    return this.eventService.updateEvent(id, eventDto);
  }

  @Delete("/:id")
  deleteEvent(@Param("id") id: string) {
    return this.eventService.deleteEvent(id);
  }
}
