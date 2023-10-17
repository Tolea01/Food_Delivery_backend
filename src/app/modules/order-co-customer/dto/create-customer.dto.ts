import { IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCustomerDto {
  @IsNotEmpty()
  @Length(3, 30)
  @IsString()
  @ApiProperty({ example: "customer name" })
  name: string;
}