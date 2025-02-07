import { PartialType } from '@nestjs/mapped-types';
import { CreateTournamentDto } from './create-tournament.dto';
import { TournamentStatus } from 'src/models/models';

export class UpdateTournamentDto extends PartialType(CreateTournamentDto) {
  status: TournamentStatus;
}
