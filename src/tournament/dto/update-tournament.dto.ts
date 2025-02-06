import { PartialType } from '@nestjs/mapped-types';
import { CreateTournamentDto } from './create-tournament.dto';
import { TournamentStatus } from 'src/entities/tournament.entity';

export class UpdateTournamentDto extends PartialType(CreateTournamentDto) {
  status: TournamentStatus;
}
