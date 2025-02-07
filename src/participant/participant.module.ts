import { forwardRef, Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { TournamentModule } from 'src/tournament/tournament.module';
import { participantProviders } from './providers/participant.providers';
import { phaseProviders } from '../providers/phase.providers';

@Module({
  imports: [forwardRef(() => TournamentModule)],
  providers: [...phaseProviders, ...participantProviders, ParticipantService],
  exports: [ParticipantService],
})
export class ParticipantModule {
}
