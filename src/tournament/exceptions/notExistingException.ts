import { NotFoundException } from '@nestjs/common';

export class NotExistingException extends NotFoundException {
  constructor(field: string) {
    super(`Le ${field} n'existe pas`);
  }
}
