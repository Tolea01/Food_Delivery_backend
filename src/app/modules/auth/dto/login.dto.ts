import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @Length(3, 50, { message: i18nValidationMessage('validation.MIN_MAX') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @ApiProperty({ example: 'username' })
  username: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @Length(6, 30, { message: i18nValidationMessage('validation.MIN_MAX') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @ApiProperty({ example: 'password' })
  password: string;
}
