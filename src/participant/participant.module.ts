import { forwardRef, Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { TournamentModule } from 'src/tournament/tournament.module';
import { participantProviders } from './providers/participant.providers';
import { phaseProviders } from '../providers/phase.providers';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [forwardRef(() => TournamentModule), ConfigModule],
  providers: [...phaseProviders, ...participantProviders, ParticipantService],
  exports: [ParticipantService],
})
export class ParticipantModule {}
