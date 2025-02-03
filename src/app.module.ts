import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TournamentModule } from './tournament/tournament.module';

@Module({
  imports: [TournamentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
