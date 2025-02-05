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

    players.sort((a, b) => b.elo - a.elo);
    return this.createBracket(players);
  }

  nextPowerOfTwo(n: number): number {
    return Math.pow(2, Math.ceil(Math.log2(n)));
  }

  private createBracket(players: Participant[]): Round[] {
    const rounds: Round[] = [];
    const totalRounds = Math.ceil(Math.log2(players.length));
    const nbOfMatchesFirstRound = this.nextPowerOfTwo(
      Math.ceil(totalRounds ** 2 / 2),
    );
    const nbTopPlayers = Math.ceil((nbOfMatchesFirstRound * 2) / 4);
    let nbOfNullPlayer = nbOfMatchesFirstRound * 2 - players.length;
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

    for (let i = 0; i < nbOfMatchesFirstRound; i++) {
      let participant1 = null;
      let participant2 = null;
      if (i <= nbTopPlayers) {
        if (i % 2 === 0) {
          participant1 = players[i];
          participant2 =
            nbOfNullPlayer > 0 ? null : players[players.length - i - 1];
        } else {
          participant1 =
            nbOfNullPlayer > 0 ? null : players[players.length - i - 1];
          participant2 = players[i];
        }
      } else {
        participant1 = players[i];
        participant2 =
          nbOfNullPlayer > 0 ? null : players[players.length - i - 1];
      }

      const match: Match = {
        participant1: participant1,
        participant2: participant2,
        status:
          participant2 != null ? MatchStatus.Playable : MatchStatus.NotPlayable,
        winner: participant2 != null ? null : players[i].name,
      };

      if (participant2 === null) {
        match.score = null;
      }
      nbOfNullPlayer--;
      rounds[0].matches[i] = match;
    }

    const firstRound = this.refactorBracket(
      rounds[0].matches,
      nbTopPlayers,
      nbOfMatchesFirstRound,
    );
    rounds[0].matches = firstRound;

    // const roundsInvertedPlayers = this.reverseRoundsAndMatches(rounds);

    const roundsAfterMovePlayer =
      null; /*this.moveWinner(roundsInvertedPlayers)*/

    return roundsAfterMovePlayer;
  }

  refactorBracket(
    matches: Match[],
    nbTopPlayers: number,
    nbOfMatchesFirstRound: number,
  ): Match[] {
    const topPlayersMatches = matches.slice(0, nbTopPlayers);
    const otherPlayersMatches = matches.slice(nbTopPlayers, matches.length);
    const brackets = [];
    const firstBracket = topPlayersMatches.slice(0, 1);
    const lastBracket = topPlayersMatches.slice(1, 2);
    const topPlayersMatchesWithoutFirstAndLast = topPlayersMatches.slice(
      2,
      topPlayersMatches.length,
    );
    const randomizedOtherPlayersMatches = otherPlayersMatches.sort(
      () => Math.random() - 0.5,
    );
    const firstTopPlayersMatches = [];
    const lastTopPlayersMatches = [];
    topPlayersMatchesWithoutFirstAndLast.forEach((match, index) => {
      if (index % 2 === 0) {
        firstTopPlayersMatches.push(match);
      } else {
        lastTopPlayersMatches.push(match);
      }
    });
    const reversedFirstTopPlayersMatches = firstTopPlayersMatches.reverse();

    brackets.push(firstBracket[0]);
    let indexReversedFirstTopPlayersMatches = 0;
    let indexLastTopPlayersMatches = 0;
    let indexRandomizedOtherPlayersMatches = 0;

    for (let i = 1; i < nbOfMatchesFirstRound - 1; i++) {
      if ((i + 1) % 4 === 0) {
        for (let j = 0; j < 2; j++) {
          if (
            indexReversedFirstTopPlayersMatches <
            reversedFirstTopPlayersMatches.length
          ) {
            brackets.push(
              reversedFirstTopPlayersMatches[
                indexReversedFirstTopPlayersMatches
              ],
            );
            if (
              brackets[brackets.length - 1].participant1.elo >
                brackets[brackets.length - 1].participant2.elo &&
              indexReversedFirstTopPlayersMatches % 2 === 0
            ) {
              const temporaryParticipant1 =
                brackets[brackets.length - 1].participant1;
              brackets[brackets.length - 1].participant1 =
                brackets[brackets.length - 1].participant2;
              brackets[brackets.length - 1].participant2 =
                temporaryParticipant1;
            }
            indexReversedFirstTopPlayersMatches++;
          } else {
            brackets.push(lastTopPlayersMatches[indexLastTopPlayersMatches]);
            if (
              brackets[brackets.length - 1].participant1.elo <
                brackets[brackets.length - 1].participant2.elo &&
              indexLastTopPlayersMatches % 2 === 0
            ) {
              const temporaryParticipant1 =
                brackets[brackets.length - 1].participant1;
              brackets[brackets.length - 1].participant1 =
                brackets[brackets.length - 1].participant2;
              brackets[brackets.length - 1].participant2 =
                temporaryParticipant1;
            }
            indexLastTopPlayersMatches++;
          }
          i = j == 0 ? i + 1 : i;
        }
      } else {
        brackets.push(
          randomizedOtherPlayersMatches[indexRandomizedOtherPlayersMatches],
        );
        indexRandomizedOtherPlayersMatches++;
      }
    }

    brackets.push(lastBracket[0]);

    return brackets;
  }

  moveWinner(rounds: Round[]) {
    rounds.forEach((round: Round, indexRound) => {
      round.matches.forEach((match: Match, indexMatch) => {
        // Pour déplacer les joueurs qui n'ont pas d'aversaire lors de la création du bracket
        if (match.status === MatchStatus.NotPlayable && match.winner != null) {
          const nextRound = indexRound + 1;
          const nextMatchIndex = Math.floor(indexMatch / 2);
          const playerPosition = indexMatch % 2;
          const player =
            match.participant1 != null
              ? match.participant1
              : match.participant2;

          if (playerPosition === 0) {
            rounds[nextRound].matches[nextMatchIndex].participant1 = player;
          } else {
            rounds[nextRound].matches[nextMatchIndex].participant2 = player;
          }
        }
      });
    });

    return rounds;
  }
}
