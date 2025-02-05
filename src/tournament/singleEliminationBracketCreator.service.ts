import { BadRequestException, Injectable } from '@nestjs/common';
import { TournamentRepository } from './tournament.repository';
import { Match, MatchStatus, Participant, Round } from '../models/models';
import { Tournament } from './entities/tournament.entity';

export
@Injectable()
class SingleEliminationBracketCreatorService {
  constructor(private readonly tournamentRepository: TournamentRepository) {}

  generateSingleEliminationBracket(tournament: Tournament) {
    const players: Participant[] = this.tournamentRepository.getParticipants(
      tournament.id,
    );

    if (!players || players.length === 0) {
      throw new BadRequestException('No participants found for the tournament');
    }

    // Sort players by Elo score in descending order
    players.sort((a, b) => b.elo - a.elo);

    // Determine the number of top seeds
    const quarterLength = Math.floor(players.length / 4);
    const powerOfTwo = 2 ** Math.floor(Math.log2(quarterLength));
    const topSeeds = players.slice(0, powerOfTwo);

    // Create the bracket
    const bracket = this.createBracket(topSeeds, players);

    console.log(bracket);
    return bracket;
  }

  private createBracket(
    topSeeds: Participant[],
    players: Participant[],
  ): Round[] {
    const rounds: Round[] = [];

    // Calculate the total number of rounds
    const totalRounds = Math.ceil(Math.log2(players.length));
    for (let i = 0; i < totalRounds; i++) {
      const newRound: Round = {
        name: `Round ${i + 1}`,
        matches: [],
      };
      rounds.push(newRound);
    }

    const nbOfMatches = Math.ceil(totalRounds ** 2 / 2);
    let nbOfNullPlayer = nbOfMatches * 2 - players.length;
    for (let i = 0; i < nbOfMatches; i++) {
      const participant2 =
        nbOfNullPlayer > 0 ? null : players[players.length - i - 1];
      const match: Match = {
        participant1: players[i],
        participant2: participant2,
        status:
          participant2 != null ? MatchStatus.Playable : MatchStatus.NotPlayable,
        winner: participant2 != null ? null : players[i].name,
      };
      if (participant2 === null) {
        match.score = null;
      }
      nbOfNullPlayer--;
      rounds[0].matches.push(match);
    }

    const firstRound = this.refactorBracket(rounds[0].matches);
    rounds[0].matches = firstRound;

    rounds[1] = this.setSecondRoundWhenPlayerSolo(
      firstRound,
      rounds[1],
    );

    return rounds;
  }

  refactorBracket(matches: Match[]) {
    let phaseBrackets = matches;
    let nbRounds = matches.length / 2;
    while (phaseBrackets.length == 0 || phaseBrackets.length > 2) {
      const globalBracket = [];
      for (let i = 0; i < nbRounds; i++) {
        const bracket = [];
        bracket.push(phaseBrackets[i]);
        bracket.push(phaseBrackets[phaseBrackets.length - i - 1]);
        globalBracket.push(bracket);
      }
      phaseBrackets = globalBracket;
      nbRounds = nbRounds / 2;
    }

    return this.flattenArray(phaseBrackets);
  }

  flattenArray(arr: any[]): any[] {
    return arr.reduce(
      (acc, val) =>
        Array.isArray(val)
          ? acc.concat(this.flattenArray(val))
          : acc.concat(val),
      [],
    );
  }

  setSecondRoundWhenPlayerSolo(firstRound, secondRound) {
    firstRound.forEach((match, index) => {
      if (match.participant2 === null) {
        secondRound.matches[Math.floor(index / 2)] = {
          participant1: match.participant1,
          participant2: null,
          status: MatchStatus.NotReady,
          winner: null,
        };
      }
    });

    return secondRound;
  }
}
