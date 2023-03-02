import {
  IsNotEmpty, IsPositive, Matches, Max, Min
} from "class-validator";

export class CreateTicketDto {
  @IsNotEmpty()
  @Matches(RegExp("^[A-Z]$"), {
    message: "Row should be only one uppercase english alphabetic character",
  })
  readonly row: string;

  @IsNotEmpty()
  @IsPositive()
  @Min(1)
  @Max(35)
  readonly column: number;
}
