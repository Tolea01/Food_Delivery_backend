import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export function ParamsApiOperation(param: string) {
  return applyDecorators(
    ApiOperation({
      summary: `Get ${param} by params`,
      description: 'If parameters are not specified, all countries will be returned',
    }),
  );
}
