import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { ParticipantModule } from 'src/participant/participant.module';
import { tournamentProviders } from './providers/tournament.providers';
import { ConfigModule } from 'src/config/config.module';
import { SingleEliminationBracketCreatorService } from './singleEliminationBracketCreator.service';

@Module({
  imports: [ConfigModule, ParticipantModule],
  controllers: [TournamentController],
  providers: [
    ...tournamentProviders,
    TournamentService,
    SingleEliminationBracketCreatorService,
  ],
  exports: [TournamentService],
})
export class TournamentModule {}
