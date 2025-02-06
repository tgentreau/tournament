import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Participant } from 'src/models/models';
import { TournamentService } from 'src/tournament/tournament.service';

@Injectable()
export class ParticipantService {
  constructor(
    @Inject(forwardRef(() => TournamentService))
    private readonly tournamentService: TournamentService,
  ) {}

  addParticipant(tournamentId: string, participant: Participant) {
    const tournament = this.tournamentService.findOne(tournamentId);
    tournament.currentParticipantNb++;

    if (tournament.status !== 'Not Started') {
      throw new BadRequestException(
        'Cannot add participant to a started tournament',
      );
    }
    if (tournament.maxParticipants != null) {
      if (tournament.participants.length < tournament.maxParticipants) {
        return this.addParticipant(tournamentId, participant);
      } else {
        throw new BadRequestException('Maximum participants reached');
      }
    } else {
      return this.addParticipant(tournamentId, participant);
    }
  }

  getParticipants(tournamentId: string): Participant[] {
    return this.getParticipants(tournamentId);
  }

  removeParticipant(tournamentId: string, participantId: string) {
    const tournament = this.tournamentService.findOne(tournamentId);

    if (tournament.status !== 'Not Started') {
      throw new BadRequestException(
        'Cannot remove participant from a started tournament',
      );
    }
    tournament.currentParticipantNb--;
    return this.removeParticipant(tournamentId, participantId);
  }
}
