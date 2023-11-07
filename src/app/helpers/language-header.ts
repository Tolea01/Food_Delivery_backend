import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function LanguageHeader() {
  return applyDecorators(
    ApiHeader({
      name: 'language',
      description: 'Language chosen by the user',
      required: true,
      schema: {
        enum: ['ro', 'ru', 'en'],
        default: 'ro',
      },
    }),
  );
}
