import { Injectable } from '@nestjs/common';
import { Tournament } from './entities/tournament.entity';
import { Participant } from 'src/models/models';

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

  public addParticipant(tournamentId: string, participant: Participant): void {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      throw new Error('Tournament not found');
    }
    if (!tournament.participants) {
      tournament.participants = [];
    }
    if (!tournament.participants.some(p => p.id === participant.id)) {
      tournament.participants.push(participant);
    }
    this.tournaments.set(tournamentId, tournament);
  }

  public getParticipants(tournamentId: string): Participant[] {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      throw new Error('Tournament not found');
    }
    return tournament.participants || [];
  }

  public removeParticipant(tournamentId: string, participantId: string): void {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      throw new Error('Tournament not found');
    }
    if (!tournament.participants) {
      return;
    }
    tournament.participants = tournament.participants.filter(p => p.id !== participantId);
    this.tournaments.set(tournamentId, tournament);
  }
}
