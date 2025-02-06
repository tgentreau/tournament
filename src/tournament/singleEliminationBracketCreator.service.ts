import { BadRequestException, Injectable } from '@nestjs/common';
import { TournamentRepository } from './tournament.repository';
import { Match, MatchStatus, Participant, Round } from '../models/models';
import { Tournament } from './entities/tournament.entity';
import { MathUtils } from '../utils/mathUtils';

export
@Injectable()
class SingleEliminationBracketCreatorService {
  constructor(private readonly tournamentRepository: TournamentRepository) {}

  public generateSingleEliminationBracket(tournament: Tournament) {
    const players: Participant[] = this.tournamentRepository.getParticipants(
      tournament.id,
    );

    if (!players || players.length === 0) {
      throw new BadRequestException('No participants found for the tournament');
    }

    players.sort((a, b) => b.elo - a.elo);
    return this.createBracket(players);
  }

  private createBracket(players: Participant[]): Round[] {
    let rounds: Round[] = [];
    const totalRounds = Math.ceil(Math.log2(players.length));
    const nbOfMatchesFirstRound = MathUtils.nextPowerOfTwo(
      Math.ceil(totalRounds ** 2 / 2),
    );
    const nbOfNullPlayer = nbOfMatchesFirstRound * 2 - players.length;

    rounds = this.constructTournamentAndSetNullAllMatches(
      rounds,
      nbOfMatchesFirstRound,
      totalRounds,
    );

    const roundWithPlayers = this.setPlayerPositionInMatch(
      players,
      nbOfNullPlayer,
      rounds,
      nbOfMatchesFirstRound,
    );

    rounds[0].matches = this.generateNewBracket(
      roundWithPlayers[0].matches,
      players,
    );

    return this.moveWinners(rounds);
  }

  private constructTournamentAndSetNullAllMatches(
    rounds: Round[],
    nbOfMatchesFirstRound: number,
    totalRounds: number,
  ) {
    let nbOfMatches = nbOfMatchesFirstRound;

    for (let i = 0; i < totalRounds; i++) {
      const newRound: Round = {
        name: `Round ${i + 1}`,
        matches: Array(nbOfMatches)
          .fill(null)
          .map(() => ({
            participant1: null,
            participant2: null,
            status: MatchStatus.NotReady,
            winner: null,
          })),
      };
      nbOfMatches /= 2;
      rounds.push(newRound);
    }
    return rounds;
  }

  private setPlayerPositionInMatch(
    players: Participant[],
    nbOfNullPlayer: number,
    rounds: Round[],
    nbOfMatchesFirstRound: number,
  ) {
    for (let i = 0; i < nbOfMatchesFirstRound; i++) {
      let participant1 = null;
      let participant2 = null;
      const opponentIndex = nbOfMatchesFirstRound * 2 - i - 1;
      const opponent =
        opponentIndex < players.length ? players[opponentIndex] : null;
      if (i % 2 === 0) {
        participant1 = players[i];
        participant2 = opponent;
      } else {
        participant1 = opponent;
        participant2 = players[i];
      }

      const match: Match = {
        participant1: participant1,
        participant2: participant2,
        status:
          participant1 != null && participant2 != null
            ? MatchStatus.Playable
            : MatchStatus.NotPlayable,
        winner: (() => {
          let winner = null;
          if (participant1 === null) {
            winner = participant2.name;
          } else if (participant2 === null) {
            winner = participant1.name;
          }
          return winner;
        })(),
      };

      if (participant2 === null) {
        match.score = null;
      }
      nbOfNullPlayer--;
      rounds[0].matches[i] = match;
    }
    return rounds;
  }

  private generateNewBracket(matches: Match[], players: Participant[]) {
    const nbMatches = matches.length;

    let currentIndex = 2;
    let result: Match[] = [matches[0], matches[1]];
    while (currentIndex < nbMatches) {
      const matchToPlace = matches[currentIndex];

      const player = players[currentIndex];
      const isBefore = matchToPlace.participant1?.id === player.id;

      const totalToReach = MathUtils.nextPowerOfTwo(currentIndex + 1) + 1;
      const opponentRanking = totalToReach - (currentIndex + 1);

      const playerToMatch = players[opponentRanking - 1];

      let matchIndex = result.findIndex(
        (m) =>
          m.participant1?.id === playerToMatch.id ||
          m.participant2?.id === playerToMatch.id,
      );
      if (!isBefore) {
        matchIndex += 1;

        // ++matchIndex => matchIndex +=1; return matchIndex
        // matchIndex++ => const tmp = matchIndex; matchIndex +1; return tmp;
      }
      result = [
        ...result.slice(0, matchIndex),
        matchToPlace,
        ...result.slice(matchIndex),
      ];

      ++currentIndex;
    }

    return result;
  }

  public moveWinners(rounds: Round[]) {
    rounds.forEach((round: Round, indexRound) => {
      round.matches.forEach((match: Match, indexMatch) => {
        if (match.winner != null) {
          const nextRound = indexRound + 1;
          const nextMatchIndex = Math.floor(indexMatch / 2);
          const playerPosition = indexMatch % 2;
          let playerToUp = null;
          for (let j = 0; j < 2; j++) {
            if (
              match.participant1 != null &&
              match.winner === match.participant1.name
            ) {
              playerToUp = match.participant1;
            } else {
              playerToUp = match.participant2;
            }
          }
          if (playerPosition === 0) {
            rounds[nextRound].matches[nextMatchIndex].participant1 = playerToUp;
          } else {
            rounds[nextRound].matches[nextMatchIndex].participant2 = playerToUp;
          }
        }
      });
    });

    return rounds;
  }
}
