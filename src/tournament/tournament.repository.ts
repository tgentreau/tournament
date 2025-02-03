import { Injectable,NotFoundException, BadRequestException } from '@nestjs/common';
import { Tournament } from './entities/tournament.entity';
import { Participant } from 'src/models/models';
import { v4 as uuidv4 } from 'uuid';

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

  public addParticipant(tournamentId: string, participant: Omit<Participant, 'id'>): string {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }
    if (!participant.name || typeof participant.name !== 'string' || participant.name.trim() === '') {
      throw new BadRequestException('Invalid participant name');
    }
    if (!Number.isInteger(participant.elo)) {
      throw new BadRequestException('Invalid participant elo');
    }
    if (!tournament.participants) {
      tournament.participants = [];
    }
    if (tournament.participants.some(p => p.name === participant.name)) {
      throw new BadRequestException('Participant already exists');
    }
    const newParticipant: Participant = { ...participant, id: uuidv4() };
    tournament.participants.push(newParticipant);
    this.tournaments.delete(tournamentId);
    this.tournaments.set(tournamentId, tournament);
    return newParticipant.id;
  }

  public getParticipants(tournamentId: string): Participant[] {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }
    return tournament.participants || [];
  }

  public removeParticipant(tournamentId: string, participantId: string): void {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament.participants) {
      return;
    }
    tournament.participants = tournament.participants.filter(p => p.id !== participantId);
    this.tournaments.set(tournamentId, tournament);
  }
}
