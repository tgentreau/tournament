import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Round } from './round.entity';
import { Participant } from './participant.entity';
import { MatchStatus } from '../models/models';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Participant)
  participant1: Participant;

  @ManyToOne(() => Participant)
  participant2: Participant;

  @ManyToOne(() => Round, (round) => round.matches)
  round: Round;

  @Column({ nullable: true })
  score: string;

  @Column({ nullable: true })
  winner: string;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.NotPlayable,
  })
  status: MatchStatus;
}
