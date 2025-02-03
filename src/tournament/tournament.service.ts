import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { TournamentRepository } from './tournament.repository';
import { Tournament } from './entities/tournament.entity';
import {
  TournamentPhaseInterface,
  TournamentPhaseType,
} from '../models/models';
import { TournamentPhase } from './entities/tournamentPhase.entity';
import { Participant } from 'src/models/models';

@Injectable()
export class TournamentService {
  constructor(private readonly tournamentRepository: TournamentRepository) {}

  create(createTournamentDto: CreateTournamentDto): string {
    const tournament: Tournament = new Tournament(createTournamentDto);
    return this.tournamentRepository.saveTournament(tournament);
  }

  findAll(): Tournament[] {
    return this.tournamentRepository.getAllTournaments();
  }

  findOne(id: string): Tournament {
    const tournament: Tournament = this.tournamentRepository.getTournament(id);
    if (tournament === undefined) {
      throw new NotFoundException("Le tournoi n'existe pas");
    }
    return tournament;
  }

  update(id: string, updateTournamentDto: UpdateTournamentDto) {
    return `This action updates a #${id} tournament`;
  }

  remove(id: string) {
    return `This action removes a #${id} tournament`;
  }

  addPhaseToTournament(
    tournamentId: string,
    phaseType: TournamentPhaseInterface,
  ): Tournament {
    const tournament = this.findOne(tournamentId);
    if (!tournament) {
      throw new BadRequestException('Tournament not found');
    }
    if (
      !Object.values(TournamentPhaseType).includes(
        phaseType.type as TournamentPhaseType,
      )
    ) {
      throw new BadRequestException(`Invalid phase type: ${phaseType.type}`);
    }
    if (
      tournament.phases.length > 0 &&
      this.getLastPhaseFromTournament(tournament).type ===
        TournamentPhaseType.SingleBracketElimination
    ) {
      throw new BadRequestException(
        'Cannot add a phase to a tournament with a SingleBracketElimination phase',
      );
    }
    const phase = new TournamentPhase(phaseType.type as TournamentPhaseType);
    tournament.addPhase(phase);
    return tournament;
  }

  getLastPhaseFromTournament(tournament: Tournament): TournamentPhase {
    return tournament.phases[tournament.phases.length - 1];
  }

  addParticipant(tournamentId: string, participant: Participant) {
    return this.tournamentRepository.addParticipant(tournamentId, participant);
  }

  getParticipants(tournamentId: string): Participant[] {
    return this.tournamentRepository.getParticipants(tournamentId);
  }

  removeParticipant(tournamentId: string, participantId: string) {
    return this.tournamentRepository.removeParticipant(
      tournamentId,
      participantId,
    );
  }
}
