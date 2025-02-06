export enum TournamentPhaseType {
  SingleBracketElimination = 'SingleBracketElimination',
  SwissRound = 'SwissRound',
}

export enum TournamentStatus {
  NotStarted = 'Not Started',
  Started = 'Started',
  Completed = 'Completed',
}

export interface TournamentPhaseInterface {
  type: TournamentPhaseType;
}

export interface Round {
  name: string;
  matches: Match[];
}

export interface Match {
  participant1: Participant;
  participant2: Participant;
}

export interface Participant {
  id: string;
  name: string;
  elo: number;
}
