import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Round } from './round.entity';
import { Participant } from './participant.entity';
import { MatchStatus } from '../models/models';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  participant1: Participant;

  @Column()
  participant2: Participant;

  @ManyToOne(() => Round, (round) => round.matches)
  round: Round;

  @Column()
  score: string;

  @Column()
  winner: string;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.NotPlayable,
  })
  status: MatchStatus;
}
