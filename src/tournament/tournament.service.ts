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
  TournamentPhaseInterface,
  TournamentPhaseType,
  TournamentStatus,
} from '../models/models';
import { Participant } from 'src/models/models';
import { Repository } from 'typeorm';
import { Phase } from './entities/phase.entity';

@Injectable()
export class TournamentService {
  constructor(
    @Inject('TOURNAMENT_REPOSITORY')
    private readonly tournamentRepository: Repository<Tournament>
  ) {}

  async create(createTournamentDto: CreateTournamentDto): Promise<string> {
    const tournament: Tournament = new Tournament();
    tournament.name = createTournamentDto.name;
    tournament.maxParticipants = createTournamentDto.maxParticipants;
    const createdTournament: Tournament = await this.tournamentRepository.save(tournament);
    return createdTournament.id;
  }

  async findAll(): Promise<Tournament[]> {
    return this.tournamentRepository.find();
  }

  async findOne(id: string): Promise<Tournament> {
    const tournament: Tournament = await this.tournamentRepository.find({where: { id: id }, take: 1})[0];
    if (tournament === undefined) {
      throw new NotFoundException("Le tournoi n'existe pas");
    }
    return tournament;
  }

  async update(id: string, updateTournamentDto: UpdateTournamentDto) {
    const tournament = await this.findOne(id);
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }
    if (updateTournamentDto.status === 'Not Started') {
      throw new BadRequestException('Invalid status : Not Started');
    }

    tournament.status = updateTournamentDto.status;
    this.tournamentRepository.save(tournament);
    throw new HttpException('', HttpStatus.NO_CONTENT);
  }

  async addPhaseToTournament(
    tournamentId: string,
    phaseType: TournamentPhaseInterface,
  ): Promise<Tournament> {
    const tournament = await this.findOne(tournamentId);
    if (!tournament) {
      throw new BadRequestException('Tournament not found');
    }
    if (tournament.status !== TournamentStatus.NotStarted) {
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
    const phase = new Phase();
    phase.type = phaseType.type;
    tournament.addPhase(phase);
    return tournament;
  }

  getLastPhaseFromTournament(tournament: Tournament): Phase {
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
