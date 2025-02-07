import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { ParticipantModule } from 'src/participant/participant.module';
import { tournamentProviders } from './providers/tournament.providers';
import { ConfigModule } from 'src/config/config.module';
import { SingleEliminationBracketCreatorService } from './singleEliminationBracketCreator.service';
import { phaseProviders } from '../providers/phase.providers';
import { participantProviders } from '../participant/providers/participant.providers';

@Module({
  imports: [ConfigModule, ParticipantModule],
  controllers: [TournamentController],
  providers: [
    ...phaseProviders,
    ...participantProviders,
    ...tournamentProviders,
    TournamentService,
    SingleEliminationBracketCreatorService,
  ],
  exports: [TournamentService],
})
export class TournamentModule {}
