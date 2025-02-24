import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { TournamentService } from 'src/tournament/tournament.service';
import { Tournament } from '../entities/tournament.entity';
import { Repository } from 'typeorm';
import { Participant } from '../entities/participant.entity';
import { TournamentStatus } from '../models/models';

@Injectable()
export class ParticipantService {
  constructor(
    @Inject(forwardRef(() => TournamentService))
    private readonly tournamentService: TournamentService,
    @Inject('PARTICIPANT_REPOSITORY')
    private readonly participantRepository: Repository<Participant>,
  ) {}

  async addParticipant(tournamentId: string, participant: Participant) {
    const tournament: Tournament =
      await this.tournamentService.findOne(tournamentId);

    if (tournament.status !== TournamentStatus.NotStarted) {
      throw new BadRequestException(
        'Cannot add participant to a started tournament',
      );
    }
    participant.tournament = tournament;
    if (tournament.maxParticipants != null) {
      if (tournament.participants.length < tournament.maxParticipants) {
        return this.participantRepository.save(participant);
      } else {
        throw new BadRequestException('Maximum participants reached');
      }
    } else {
      return this.participantRepository.save(participant);
    }
  }

  async getParticipants(tournamentId: string): Promise<Participant[]> {
    return this.participantRepository.findBy({ tournamentId: tournamentId });
  }

  async removeParticipant(tournamentId: string, participantId: string) {
    const tournament: Tournament =
      await this.tournamentService.findOne(tournamentId);

    if (tournament.status === TournamentStatus.Started) {
      throw new BadRequestException(
        'Cannot remove participant from a started tournament',
      );
    }
    await this.participantRepository.delete(participantId);
  }
}
