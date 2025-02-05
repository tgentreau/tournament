import { TournamentPhaseType, TournamentStatus } from '../../models/models';
import { Participant } from './participant.entity';
import { Phase } from './phase.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tournament {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  maxParticipants?: number;

  @OneToMany(() => Phase, phase => phase.tournament)
  phases: Phase[];

  @OneToMany(() => Participant, participant => participant.tournament)
  participants: Participant[];

  @Column({
    type: "enum",
    enum: TournamentStatus,
    default: TournamentStatus.NotStarted,
  })
  status: TournamentStatus;
  
}
