import { Type } from "class-transformer";
import { IsISO8601, IsString, ValidateNested } from "class-validator";
import { CreateTicketDto } from "src/modules/ticket/dtos/create-ticket.dto";
import { CheckNumberOfSeats } from "./seats-number.decorator";

export class CreateBuyerDto {
  @IsString()
  readonly id: string;

  @IsISO8601()
  readonly birthday: string;

  @CheckNumberOfSeats({
    message: "You are allowed to buy between 1 and 4 tickets",
  })
  @ValidateNested({ each: true })
  @Type(() => CreateTicketDto)
  seats: CreateTicketDto[];
}
