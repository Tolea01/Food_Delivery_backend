import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export default function (
  error: Error | BadRequestException | NotFoundException | ConflictException,
): void {
  if (
    error instanceof BadRequestException ||
    error instanceof NotFoundException ||
    error instanceof ConflictException
  ) {
    throw error;
  } else {
    throw new InternalServerErrorException(error.message);
  }
}
