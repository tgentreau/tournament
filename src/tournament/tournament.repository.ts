import { Injectable } from '@nestjs/common';
import { Tournament } from './entities/tournament.entity';

@Injectable()
export class TournamentRepository {
  private tournaments = new Map<string, Tournament>();

  public saveTournament(tournament: Tournament): string {
    this.tournaments.set(tournament.id, tournament);
    return tournament.id;
  }

  public getTournament(tournamentId: string): Tournament {
    return this.tournaments.get(tournamentId);
  }

  public getAllTournaments(): Tournament[] {
    return Array.from(this.tournaments.values());
  }
}
