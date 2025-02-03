export class CreateTournamentDto {
  name: string;
  maxParticipants?: number;
  status?: string;
  constructor(name: string, maxParticipants?: number) {
    this.name = name;
    this.maxParticipants = maxParticipants;
    this.status = this.status;
  }
}
