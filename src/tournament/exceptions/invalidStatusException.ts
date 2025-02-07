import { BadRequestException } from '@nestjs/common';

export class InvalidStatusException extends BadRequestException {
  constructor() {
    super(`Le statut du tournoi n'est pas valide`);
  }
}