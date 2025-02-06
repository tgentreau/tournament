import { Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { TournamentModule } from 'src/tournament/tournament.module';

@Module({
  imports: [TournamentModule],
  providers: [ParticipantService],
  controllers: [TournamentModule],
})
export class ParticipantModule {}
