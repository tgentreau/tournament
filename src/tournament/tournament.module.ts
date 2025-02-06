import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { TournamentRepository } from './tournament.repository';
import { ParticipantModule } from 'src/participant/participant.module';

@Module({
  imports: [ParticipantModule],
  controllers: [TournamentController],
  providers: [TournamentService, TournamentRepository],
  exports: [TournamentService],
})
export class TournamentModule {}
