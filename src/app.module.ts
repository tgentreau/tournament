import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TournamentModule } from './tournament/tournament.module';
import { ConfigModule } from './config/config.module';
import { ParticipantModule } from './participant/participant.module';

@Module({
  imports: [TournamentModule, ConfigModule, ParticipantModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
