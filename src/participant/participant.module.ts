import { Module, forwardRef } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { TournamentModule } from 'src/tournament/tournament.module';

@Module({
  imports: [forwardRef(() => TournamentModule)],
  providers: [ParticipantService],
  exports: [ParticipantService],
})
export class ParticipantModule {}
