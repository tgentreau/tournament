import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { TournamentRepository } from './tournament.repository';
import { Tournament } from './entities/tournament.entity';
import { Participant } from 'src/models/models';

@Injectable()
export class TournamentService {
  constructor(private readonly tournamentRepository: TournamentRepository) {}
  create(createTournamentDto: CreateTournamentDto): string {
    if (createTournamentDto.name === '') {
      throw new BadRequestException('Le nom est vide');
    }
    const tournaments: Tournament[] =
      this.tournamentRepository.getAllTournaments();
    for (const tournament of tournaments) {
      if (tournament.name === createTournamentDto.name) {
        throw new BadRequestException('Le nom est déjà utilisé');
      }
    }
    const tournament: Tournament = new Tournament(createTournamentDto);
    return this.tournamentRepository.saveTournament(tournament);
  }

  findAll(): Tournament[] {
    return this.tournamentRepository.getAllTournaments();
  }

  findOne(id: string): Tournament {
    const tournament: Tournament = this.tournamentRepository.getTournament(id);
    if (tournament === undefined) {
      throw new NotFoundException("Le tournoi n'existe pas");
    }
    return tournament;
  }

  update(id: string, updateTournamentDto: UpdateTournamentDto) {
    return `This action updates a #${id} tournament`;
  }

  remove(id: string) {
    return `This action removes a #${id} tournament`;
  }

  addParticipant(tournamentId: string, participant: Participant) {
    return this.tournamentRepository.addParticipant(tournamentId, participant);
  }

  getParticipants(tournamentId: string): Participant[] {
    return this.tournamentRepository.getParticipants(tournamentId);
  }

  removeParticipant(tournamentId: string, participantId: string) {
    return this.tournamentRepository.removeParticipant(tournamentId, participantId);
  }
}
