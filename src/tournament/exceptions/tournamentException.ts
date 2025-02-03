import { BadRequestException } from '@nestjs/common';

export class TournamentException extends Error {
  constructor(message) {
    super(message);
    this.name = 'TournamentException';
  }
}

export class TournamentBadRequestException extends BadRequestException {
  constructor(message) {
    super(message);
    this.name = 'TournamentBadRequestException';
  }
}
