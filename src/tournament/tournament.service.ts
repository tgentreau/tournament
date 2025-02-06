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
  PostgresErrorCode,
  TournamentPhaseInterface,
  TournamentPhaseType,
  TournamentStatus,
} from '../models/models';
import { Phase } from './entities/phase.entity';
import { Participant } from 'src/models/models';
import { QueryFailedError } from 'typeorm';
import { UniqueConstraintException } from './exceptions/uniqueConstraintException';
import { NullConstraintException } from './exceptions/nullConstraintException';
import { NotExistingException } from './exceptions/notExistingException';
import { InvalidStatusException } from './exceptions/invalidStatusException';
@Injectable()
export class TournamentService {
  constructor(private readonly tournamentRepository: TournamentRepository) {}

  create(createTournamentDto: CreateTournamentDto): string {
    try{
      const tournament: Tournament = new Tournament();
      tournament.name = createTournamentDto.name;
      tournament.maxParticipants = createTournamentDto.maxParticipants;
      return this.tournamentRepository.saveTournament(tournament);
    }catch(error){
      if (error instanceof QueryFailedError) {
        if (error.driverError?.code === PostgresErrorCode.UniqueValueViolation) {
          throw new UniqueConstraintException('name');
        }
        if (error.driverError?.code === PostgresErrorCode.NullValueNotAllowed) {
          throw new NullConstraintException('name');
        }
      }
    }
  }

  findAll(): Tournament[] {
    return this.tournamentRepository.getAllTournaments();
  }

  findOne(id: string): Tournament {
    const tournament: Tournament = this.tournamentRepository.getTournament(id);
    if (tournament === undefined) {
      throw new NotExistingException("tournoi");
    }
    return tournament;
  }

  update(id: string, updateTournamentDto: UpdateTournamentDto) {
    const tournament = this.findOne(id);
    if (!tournament) {
      throw new NotExistingException("tournoi");
    }
    try{
      tournament.status = updateTournamentDto.status;
      this.tournamentRepository.saveTournament(tournament);
      throw new HttpException('', HttpStatus.NO_CONTENT);
    }catch(error){
      if (error instanceof QueryFailedError) {
        if (error.driverError?.code === PostgresErrorCode.InvalidEnumValue) {
          throw new InvalidStatusException();
        }
      }
    }
  }

  addPhaseToTournament(
    tournamentId: string,
    phaseType: TournamentPhaseInterface,
  ): Tournament {
    const tournament = this.findOne(tournamentId);
    if (!tournament) {
      throw new NotExistingException("tournoi");
    }
    if (tournament.status !== TournamentStatus.NotStarted) {
      throw new BadRequestException('Impossible d\'ajouter une phase à un tournoi commencé');
    }
    if (
      tournament.phases.length > 0 &&
      this.getLastPhaseFromTournament(tournament) ===
        TournamentPhaseType.SingleBracketElimination
    ) {
      throw new BadRequestException(
        'Impossible d\'ajouter une phase à un tournoi avec une phase de type SingleBracketElimination',
      );
    }
   try{ 
    const phase = new Phase();
    phase.type = phaseType.type;
    tournament.addPhase(phase);
    return tournament;
  }catch(error){
    if (error instanceof QueryFailedError) {
      if (error.driverError?.code === PostgresErrorCode.InvalidEnumValue) {
        throw new InvalidStatusException();
      }
    }
  }
  }

  getLastPhaseFromTournament(tournament: Tournament): TournamentPhaseType {
    return tournament.phases[tournament.phases.length - 1].type;
  }

  addParticipant(tournamentId: string, participant: Participant) {
    const tournament = this.findOne(tournamentId);
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
    return this.tournamentRepository.removeParticipant(
      tournamentId,
      participantId,
    );
  }
}
