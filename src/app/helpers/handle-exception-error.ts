import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export default function (error: Error | BadRequestException | NotFoundException): void {
  if (error instanceof BadRequestException || error instanceof NotFoundException) {
    throw error;
  } else {
    throw new InternalServerErrorException(error.message);
  }
}
