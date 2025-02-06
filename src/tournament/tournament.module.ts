import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { tournamentProviders } from './providers/tournament.providers';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule],
  controllers: [TournamentController],
  providers: [...tournamentProviders, TournamentService],
})
export class TournamentModule {}
