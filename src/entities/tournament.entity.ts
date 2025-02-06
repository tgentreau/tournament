import { v4 as uuidv4 } from 'uuid';
import { Participant, TournamentPhaseType } from '../../models/models';
import { CreateTournamentDto } from '../dto/create-tournament.dto';
import { TournamentPhase } from './tournamentPhase.entity';

export class Tournament {
  id: string;
  name: string;
  maxParticipants?: number;
  currentParticipantNb: number;
  phases: TournamentPhase[];
  participants: Participant[];
  status: TournamentStatus;
  constructor(tournamentDTO: CreateTournamentDto) {
    this.id = uuidv4();
    this.name = tournamentDTO.name;
    this.maxParticipants = tournamentDTO.maxParticipants;
    this.currentParticipantNb = 0;
    this.phases = [];
    this.participants = [];
    this.status = TournamentStatus.NOT_STARTED;
  }

  addPhase(phaseType: TournamentPhase): void {
    const newPhase = new TournamentPhase(phaseType.type as TournamentPhaseType);
    this.phases.push(newPhase);
  }
}

export enum TournamentStatus {
  NOT_STARTED = 'Not Started',
  STARTED = 'Started',
  FINISHED = 'Finished',
}
