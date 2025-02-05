import { v4 as uuidv4 } from 'uuid';
import { Round, TournamentPhaseType } from '../../models/models';

export class TournamentPhase {
  id: string;
  type: TournamentPhaseType;
  rounds?: Round[];

  constructor(type: TournamentPhaseType) {
    this.id = uuidv4();
    this.type = type;
  }
}
