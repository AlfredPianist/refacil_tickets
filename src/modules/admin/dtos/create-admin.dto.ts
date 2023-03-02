import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  Max,
  IsStrongPassword,
} from "class-validator";

export class CreateAdminDto {
  @IsString()
  readonly username: string;

  @IsStrongPassword({
    minLength: 10,
    minNumbers: 3,
    minSymbols: 3,
    minLowercase: 2,
    minUppercase: 2,
  })
  readonly password: string;
}
