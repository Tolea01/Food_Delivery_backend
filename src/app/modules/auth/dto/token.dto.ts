import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class TokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJpYXQiOjE2NjM0OTY0ODQsImV4cCI6MTY2MzQ5NjU0NH0.AUzAT1H4W4RQ_gci2WzZAp1PiUAPWHGWQRzf3gB4Sm',
  })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  token: string;
}
