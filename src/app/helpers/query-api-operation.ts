import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function QueryApiOperation(param: string, description?: string, type?: string) {
  return applyDecorators(
    ApiQuery({
      name: `${param}`,
      description: `${description}`,
      type: `${type}`,
      required: false,
    }),
  );
}
