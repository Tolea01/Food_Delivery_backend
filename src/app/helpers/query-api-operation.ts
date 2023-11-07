import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function QueryApiOperation(param: string) {
  return applyDecorators(ApiQuery({ name: `${param}`, required: false }));
}
