import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
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
import { SingleEliminationBracketCreatorService } from './singleEliminationBracketCreator.service';
import { Repository } from 'typeorm';
import { Phase } from './entities/phase.entity';

@Injectable()
export class TournamentService {
  constructor(
    @Inject('TOURNAMENT_REPOSITORY')
    private readonly tournamentRepository: Repository<Tournament>,
    private readonly singleEliminationBracketCreatorService: SingleEliminationBracketCreatorService,
  ) {}

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

  async findOne(id: string): Promise<Tournament> {
    const tournament: Tournament = await this.tournamentRepository.find({where: { id: id }, take: 1})[0];
    if (tournament === undefined) {
      throw new NotExistingException("tournoi");
    }
    return tournament;
  }

  async update(id: string, updateTournamentDto: UpdateTournamentDto) {
    const tournament = await this.findOne(id);
    if (!tournament) {
      throw new NotExistingException("tournoi");
    }
    if (updateTournamentDto.status === 'Not Started') {
      throw new BadRequestException('Invalid status : Not Started');
    }

    tournament.status = updateTournamentDto.status;
    tournament.phases[0].rounds =
      this.singleEliminationBracketCreatorService.generateSingleEliminationBracket(
        tournament.participants,
      );
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

  async addPhaseToTournament(
    tournamentId: string,
    phaseType: TournamentPhaseInterface,
  ): Promise<Tournament> {
    const tournament = await this.findOne(tournamentId);
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
