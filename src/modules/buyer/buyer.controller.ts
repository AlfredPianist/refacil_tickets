import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param
} from "@nestjs/common";
import { BuyerService } from "./buyer.service";

@Controller("buyers")
export class BuyerController {
  constructor(private buyerService: BuyerService) {}

  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  showBuyer(@Param("id") id: string) {
    return this.buyerService.showBuyer(id);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBuyer(@Param("id") id: string) {
    return this.buyerService.deleteBuyer(id);
  }
}
