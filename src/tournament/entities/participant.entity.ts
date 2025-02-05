import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tournament } from "./tournament.entity";

export class Participant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    elo: number;

    @ManyToOne(() => Tournament, tournament => tournament.participants)
    tournament: Tournament;
}