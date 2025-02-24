import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import {
  PostgresErrorCode,
  TournamentPhaseInterface,
  TournamentPhaseType,
  TournamentStatus,
} from '../models/models';
import { QueryFailedError, Repository } from 'typeorm';
import { UniqueConstraintException } from './exceptions/uniqueConstraintException';
import { NullConstraintException } from './exceptions/nullConstraintException';
import { NotExistingException } from './exceptions/notExistingException';
import { InvalidStatusException } from './exceptions/invalidStatusException';
import { SingleEliminationBracketCreatorService } from './singleEliminationBracketCreator.service';
import { Tournament } from '../entities/tournament.entity';
import { Phase } from '../entities/phase.entity';

@Injectable()
export class TournamentService {
  constructor(
    @Inject('TOURNAMENT_REPOSITORY')
    private readonly tournamentRepository: Repository<Tournament>,
    @Inject('PHASE_REPOSITORY')
    private readonly phaseRepository: Repository<Phase>,
    private readonly singleEliminationBracketCreatorService: SingleEliminationBracketCreatorService,
  ) {}

  async create(createTournamentDto: CreateTournamentDto): Promise<string> {
    try {
      const tournament: Tournament = new Tournament();
      tournament.name = createTournamentDto.name;
      tournament.maxParticipants = createTournamentDto.maxParticipants;

      return (await this.tournamentRepository.save(tournament)).id;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (
          error.driverError?.code === PostgresErrorCode.UniqueValueViolation
        ) {
          throw new UniqueConstraintException('name');
        }
        if (error.driverError?.code === PostgresErrorCode.NullValueNotAllowed) {
          throw new NullConstraintException('name');
        }
      }
    }
  }

  async findOne(id: string): Promise<Tournament> {
    const tournament: Tournament = await this.tournamentRepository.findOne({
      where: { id: id },
      relations: [
        'phases.rounds.matches.participant1',
        'phases.rounds.matches.participant2',
        'participants',
      ],
    });
    if (tournament === undefined) {
      throw new NotExistingException('tournoi');
    }
    return tournament;
  }

  async update(id: string, updateTournamentDto: UpdateTournamentDto) {
    const tournament = await this.findOne(id);
    if (!tournament) {
      throw new NotExistingException('tournoi');
    }
    if (updateTournamentDto.status === 'Not Started') {
      throw new BadRequestException('Invalid status : Not Started');
    }
    tournament.status = updateTournamentDto.status;
    tournament.phases[0].rounds =
      this.singleEliminationBracketCreatorService.generateSingleEliminationBracket(
        tournament.participants,
      );
    console.log(tournament.phases[0].rounds);
    try {
      tournament.status = updateTournamentDto.status;
      await this.tournamentRepository.save(tournament);
      return new HttpException('', HttpStatus.NO_CONTENT);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError?.code === PostgresErrorCode.InvalidEnumValue) {
          throw new InvalidStatusException();
        }
      }
      throw error;
    }
  }

  async addPhaseToTournament(
    tournamentId: string,
    phaseType: TournamentPhaseInterface,
  ): Promise<Phase> {
    const tournament: Tournament = await this.findOne(tournamentId);
    if (!tournament) {
      throw new NotExistingException('tournoi');
    }
    if (tournament.status !== TournamentStatus.NotStarted) {
      throw new BadRequestException(
        "Impossible d'ajouter une phase à un tournoi commencé",
      );
    }
    if (
      tournament.phases.length > 0 &&
      this.getLastPhaseFromTournament(tournament) ===
        TournamentPhaseType.SingleBracketElimination
    ) {
      throw new BadRequestException(
        "Impossible d'ajouter une phase à un tournoi avec une phase de type SingleBracketElimination",
      );
    }
    try {
      const phase: Phase = new Phase();
      phase.type = phaseType.type;
      phase.tournament = tournament;
      return await this.phaseRepository.save(phase);
    } catch (error) {
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
}
