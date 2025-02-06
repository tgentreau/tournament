import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { TournamentRepository } from './tournament.repository';
import { SingleEliminationBracketCreatorService } from './singleEliminationBracketCreator.service';

@Module({
  controllers: [TournamentController],
  providers: [
    TournamentService,
    TournamentRepository,
    SingleEliminationBracketCreatorService,
  ],
})
export class TournamentModule {}
