import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TournamentModule } from './tournament/tournament.module';
import { ConfigModule } from '@nestjs/config';
import { ParticipantModule } from './participant/participant.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    TournamentModule,
    ConfigModule,
    ParticipantModule,
    ConfigModule.forRoot({ cache: true }),
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
