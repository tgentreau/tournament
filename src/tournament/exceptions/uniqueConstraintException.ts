import { BadRequestException } from '@nestjs/common';

export class UniqueConstraintException extends BadRequestException {
    constructor(field: string) {
      super(`La valeur du champ ${field} doit être unique`);
    }
  }