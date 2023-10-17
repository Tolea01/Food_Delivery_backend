import { IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCustomerDto {
  @IsNotEmpty()
  @Length(3, 30)
  @IsString()
  @ApiProperty({ example: "new customer name" })
  name?: string;
}