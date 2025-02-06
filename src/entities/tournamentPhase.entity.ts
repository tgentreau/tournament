import { v4 as uuidv4 } from 'uuid';
import { TournamentPhaseType } from 'src/models/models';

export class TournamentPhase {
  id: string;
  type: TournamentPhaseType;

  constructor(type: TournamentPhaseType) {
    this.id = uuidv4();
    this.type = type;
  }
}
