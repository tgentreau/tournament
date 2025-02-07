import { Participant } from './participant.entity';
import { Phase } from './phase.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TournamentStatus } from '../models/models';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column({ nullable: true })
  maxParticipants?: number;

  @OneToMany(() => Phase, (phase) => phase.tournament)
  phases: Phase[];

  @OneToMany(() => Participant, (participant) => participant.tournament)
  participants: Participant[];

  @Column({
    type: 'enum',
    enum: TournamentStatus,
    default: TournamentStatus.NotStarted,
  })
  status: TournamentStatus;
}
