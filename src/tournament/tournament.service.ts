import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { TournamentRepository } from './tournament.repository';
import { Tournament } from './entities/tournament.entity';

@Injectable()
export class TournamentService {
  constructor(private readonly tournamentRepository: TournamentRepository) {}
  create(createTournamentDto: CreateTournamentDto): string {
    const tournament: Tournament = new Tournament(createTournamentDto);
    return this.tournamentRepository.saveTournament(tournament);
  }

  findAll(): Tournament[] {
    return this.tournamentRepository.getAllTournaments();
  }

  findOne(id: string): Tournament {
    return this.tournamentRepository.getTournament(id);
  }

  update(id: string, updateTournamentDto: UpdateTournamentDto) {
    const tournament = this.findOne(id);
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }
    if (updateTournamentDto.status === 'Not Started') {
      throw new HttpException(
        'Invalid status : Not Started',
        HttpStatus.NOT_FOUND,
      );
    }
    throw new HttpException('', HttpStatus.NO_CONTENT);
  }

  remove(id: string) {
    return `This action removes a #${id} tournament`;
  }
}
