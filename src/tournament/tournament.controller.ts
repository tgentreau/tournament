import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Tournament } from './entities/tournament.entity';
import { TournamentPhaseInterface } from '../models/models';
import { Participant } from 'src/models/models';

@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Post()
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentService.create(createTournamentDto);
  }

  @Get()
  findAll(): Tournament[] {
    return this.tournamentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Tournament {
    return this.tournamentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ) {
    return this.tournamentService.update(id, updateTournamentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentService.remove(id);
  }

  @Post(':id/phase')
  addPhase(@Param('id') id: string, @Body() body: TournamentPhaseInterface) {
    console.log(body);
    return this.tournamentService.addPhaseToTournament(id, body);
  }

  @Post(':id/participants')
  addParticipant(@Param('id') id: string, @Body() participant: Participant) {
    return this.tournamentService.addParticipant(id, participant);
  }

  @Get(':id/participants')
  getParticipants(@Param('id') id: string) {
    return this.tournamentService.getParticipants(id);
  }

  @Delete(':id/participants/:participantId')
  removeParticipant(
    @Param('id') id: string,
    @Param('participantId') participantId: string,
  ) {
    return this.tournamentService.removeParticipant(id, participantId);
  }
}
