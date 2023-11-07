import { ColumnOptions } from 'typeorm';

export function createUniqueColumnOptions(length?: number): ColumnOptions {
  return {
    nullable: false,
    unique: true,
    length,
  };
}
