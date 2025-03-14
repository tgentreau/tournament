import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tournament } from './tournament.entity';
import { Round } from './round.entity';
import { TournamentPhaseType } from '../models/models';

@Entity()
export class Phase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TournamentPhaseType,
  })
  type: TournamentPhaseType;

  @ManyToOne(() => Tournament, (tournament) => tournament.phases)
  tournament: Tournament;

  @OneToMany(() => Round, (round) => round.phase, { cascade: true })
  rounds: Round[];
}
