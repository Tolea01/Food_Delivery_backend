import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCustomerDto {
  @IsNotEmpty()
  @Length(3, 30)
  @IsString()
  name: string;
}