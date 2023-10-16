import { IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @IsNotEmpty()
  @Length(3, 50)
  @IsString()
  @ApiProperty({ example: "username" })
  username: string;

  @IsNotEmpty()
  @Length(6, 30)
  @IsString()
  @ApiProperty({ example: "password" })
  password: string;
}