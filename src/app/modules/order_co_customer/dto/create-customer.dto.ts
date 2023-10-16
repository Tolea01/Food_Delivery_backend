import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCustomerDto {
  @IsNotEmpty({ message: "Name is required!" })
  @Length(3, 30, { message: "Name must be between 3 and 30 characters!" })
  @IsString()
  name: string;
}