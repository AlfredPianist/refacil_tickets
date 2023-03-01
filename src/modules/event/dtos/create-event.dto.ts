import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  Max,
} from "class-validator";

export class CreateEventDto {
  @IsString()
  readonly name: string;

  @IsInt()
  @Min(1)
  @Max(27)
  readonly rows: number;

  @IsInt()
  @Min(1)
  @Max(35)
  readonly columns: number;

  @IsNumber()
  @IsPositive()
  readonly price: number;
}
