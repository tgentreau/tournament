import { v4 as uuidv4 } from 'uuid';
import { Participant, TournamentPhase } from '../../models/models';
import { CreateTournamentDto } from '../dto/create-tournament.dto';

export class Tournament {
  id: string;
  name: string;
  maxParticipants?: number;
  currentParticipantNb: number;
  phases: TournamentPhase[];
  participants: Participant[];
  status: string;
  constructor(tournamentDTO: CreateTournamentDto) {
    this.id = uuidv4();
    this.name = tournamentDTO.name;
    this.maxParticipants = tournamentDTO.maxParticipants;
    this.currentParticipantNb = 0;
    this.phases = [];
    this.participants = [];
    this.status = 'Not Started';
  }
}
