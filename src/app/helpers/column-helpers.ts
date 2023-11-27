import { Column, ColumnOptions } from 'typeorm';
import { applyDecorators } from '@nestjs/common';

export function UniqueColumn(length?: number) {
  return applyDecorators(
    Column({
      nullable: false,
      unique: true,
      length,
    }),
  );
}
