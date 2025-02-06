import { BadRequestException } from '@nestjs/common';

export class NullConstraintException extends BadRequestException {
    constructor(field: string) {
      super(`La valeur du champ ${field} ne peux pas être nulle`);
    }
  }