import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Phase } from './phase.entity';
import { Match } from './match.entity';

@Entity()
export class Round {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Match, (match) => match.round)
  matches: Match[];

  @ManyToOne(() => Phase, (phase) => phase.rounds)
  phase: Phase;
}
