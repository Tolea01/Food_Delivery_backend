import { IsNotEmpty, IsString, Length } from "class-validator";

export class UpdateCustomerDto {
  @IsNotEmpty()
  @Length(3, 30, { message: "Name must be between 3 and 30 characters!" })
  @IsString()
  name?: string;
}