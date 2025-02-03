export class CreateTournamentDto {
  name: string;
  maxParticipants?: number;

  constructor(name: string, maxParticipants?: number) {
    this.name = name;
    this.maxParticipants = maxParticipants;
  }
}
