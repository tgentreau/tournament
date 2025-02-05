import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { TournamentRepository } from './tournament.repository';
import { Tournament } from './entities/tournament.entity';
import {
  TournamentPhaseInterface,
  TournamentPhaseType,
} from '../models/models';
import { TournamentPhase } from './entities/phase.entity';
import { Participant } from 'src/models/models';

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
    throw new HttpException('', HttpStatus.NO_CONTENT);
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

  addParticipant(tournamentId: string, participant: Participant) {
    const tournament = this.findOne(tournamentId);
    tournament.currentParticipantNb++;

    if (tournament.status !== 'Not Started') {
      throw new BadRequestException(
        'Cannot add participant to a started tournament',
      );
    }
    if (tournament.maxParticipants != null) {
      if (tournament.participants.length < tournament.maxParticipants) {
        return this.tournamentRepository.addParticipant(
          tournamentId,
          participant,
        );
      } else {
        throw new BadRequestException('Maximum participants reached');
      }
    } else {
      return this.tournamentRepository.addParticipant(
        tournamentId,
        participant,
      );
    }
  }

  getParticipants(tournamentId: string): Participant[] {
    return this.tournamentRepository.getParticipants(tournamentId);
  }

  removeParticipant(tournamentId: string, participantId: string) {
    const tournament = this.findOne(tournamentId);

    if (tournament.status !== 'Not Started') {
      throw new BadRequestException(
        'Cannot remove participant from a started tournament',
      );
    }
    tournament.currentParticipantNb--;
    return this.tournamentRepository.removeParticipant(
      tournamentId,
      participantId,
    );
  }
}
