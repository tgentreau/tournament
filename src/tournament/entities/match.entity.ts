import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Round } from './round.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  idParticipant1: string;

  @Column()
  iDParticipant2: string;

  @ManyToOne(() => Round, (round) => round.matches)
  round: Round;
}
