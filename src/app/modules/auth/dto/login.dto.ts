import { IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @Length(3, 50)
  @ApiProperty({ example: 'username' })
  username: string;

  @IsNotEmpty()
  @Length(6, 30)
  @ApiProperty({example: 'password'})
  password: string;
}