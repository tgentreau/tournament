import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { TournamentRepository } from './tournament.repository';
import { Tournament } from '../entities/tournament.entity';
import {
  TournamentPhaseInterface,
  TournamentPhaseType,
} from '../models/models';
import { TournamentPhase } from '../entities/tournamentPhase.entity';

@Injectable()
export class TournamentService {
  constructor(private readonly tournamentRepository: TournamentRepository) {}

  create(createTournamentDto: CreateTournamentDto): string {
    if (!createTournamentDto.name) {
      throw new BadRequestException('Le nom est requis');
    }

    const tournament: Tournament = new Tournament(createTournamentDto);
    const tournaments: Tournament[] = this.findAll();
    if (tournaments.some((t) => t.name === tournament.name)) {
      throw new BadRequestException('Un tournoi avec ce nom existe déjà');
    }
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
    const tournament = this.findOne(id);
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }
    if (updateTournamentDto.status === 'Not Started') {
      throw new BadRequestException('Invalid status : Not Started');
    }

    tournament.status = updateTournamentDto.status;
    this.tournamentRepository.saveTournament(tournament);
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
    if (tournament.status !== 'Not Started') {
      throw new BadRequestException('Cannot add phase to a started tournament');
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
}
