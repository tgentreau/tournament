import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { TournamentRepository } from './tournament.repository';

@Module({
  controllers: [TournamentController],
  providers: [TournamentService, TournamentRepository],
})
export class TournamentModule {}
