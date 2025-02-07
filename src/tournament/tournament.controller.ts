import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Tournament } from '../entities/tournament.entity';
import { TournamentPhaseInterface } from '../models/models';
import { ParticipantService } from 'src/participant/participant.service';
import { Participant } from '../entities/participant.entity';

@Controller('tournament')
export class TournamentController {
  constructor(
    private readonly tournamentService: TournamentService,
    @Inject(forwardRef(() => ParticipantService))
    private readonly participantService: ParticipantService,
  ) {}

  @Post()
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentService.create(createTournamentDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Tournament> {
    return this.tournamentService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(204)
  update(
    @Param('id') id: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ) {
    return this.tournamentService.update(id, updateTournamentDto);
  }

  @Post(':id/phase')
  addPhase(@Param('id') id: string, @Body() body: TournamentPhaseInterface) {
    console.log(body);
    return this.tournamentService.addPhaseToTournament(id, body);
  }

  @Post(':id/participants')
  addParticipant(@Param('id') id: string, @Body() participant: Participant) {
    return this.participantService.addParticipant(id, participant);
  }

  @Get(':id/participants')
  getParticipants(@Param('id') id: string) {
    return this.participantService.getParticipants(id);
  }

  @Delete(':id/participants/:participantId')
  removeParticipant(
    @Param('id') id: string,
    @Param('participantId') participantId: string,
  ) {
    return this.participantService.removeParticipant(id, participantId);
  }
}
