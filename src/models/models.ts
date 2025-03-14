export enum TournamentPhaseType {
  SingleBracketElimination = 'SingleBracketElimination',
  SwissRound = 'SwissRound',
}

export enum MatchStatus {
  Playable = 'Playable',
  NotPlayable = 'NotPlayable',
  NotReady = 'NotReady',
}

export enum TournamentStatus {
  NotStarted = 'Not Started',
  Started = 'Started',
  Completed = 'Completed',
}

export enum PostgresErrorCode {
  InvalidEnumValue = '22P02',
  NullValueNotAllowed = '23502',
  UniqueValueViolation = '23505',
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
  status: MatchStatus;
  winner: string;
  score?: number;
}

export interface Participant {
  id: string;
  name: string;
  elo: number;
}
