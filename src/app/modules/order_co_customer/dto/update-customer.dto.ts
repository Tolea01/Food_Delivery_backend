import { IsNotEmpty, IsString, Length } from "class-validator";

export class UpdateCustomerDto {
  @IsNotEmpty()
  @Length(3, 30)
  @IsString()
  name?: string;
}