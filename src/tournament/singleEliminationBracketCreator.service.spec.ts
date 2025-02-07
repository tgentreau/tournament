import { Test, TestingModule } from '@nestjs/testing';
import { SingleEliminationBracketCreatorService } from './singleEliminationBracketCreator.service';
import { MatchStatus, Participant, Round } from '../models/models';

describe('SingleEliminationBracketCreatorService - generateSingleEliminationBracket', () => {
  let service: SingleEliminationBracketCreatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SingleEliminationBracketCreatorService,
        {
          provide: TournamentRepository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SingleEliminationBracketCreatorService>(
      SingleEliminationBracketCreatorService,
    );
  });

  it('should generate a single elimination bracket with 8 participants', () => {
    const participants: Participant[] = Array.from({ length: 8 }, (_, i) => ({
      id: (i + 1).toString(),
      name: `Player ${i + 1}`,
      elo: 2000 - i * 50,
    }));

    const bracket: Round[] =
      service.generateSingleEliminationBracket(participants);

    expect(bracket).toBeDefined();
    expect(bracket.length).toBe(3); // 3 rounds for 8 participants
    expect(bracket[0].matches.length).toBe(4); // First round should have 4 matches
    expect(bracket[0].matches[0].participant1).toBe(participants[0]);
    expect(bracket[0].matches[0].participant2).toBe(participants[7]);
    expect(bracket[0].matches[0].status).toBe(MatchStatus.Playable);
  });

  it('should generate a single elimination bracket with 16 participants', () => {
    const participants: Participant[] = Array.from({ length: 16 }, (_, i) => ({
      id: (i + 1).toString(),
      name: `Player ${i + 1}`,
      elo: 2000 - i * 50,
    }));

    const bracket: Round[] =
      service.generateSingleEliminationBracket(participants);

    expect(bracket).toBeDefined();
    expect(bracket.length).toBe(4); // 3 rounds for 8 participants
    expect(bracket[0].matches.length).toBe(8); // First round should have 4 matches
    expect(bracket[0].matches[0].participant1).toBe(participants[0]);
    expect(bracket[0].matches[0].participant2).toBe(participants[15]);
    expect(bracket[0].matches[0].status).toBe(MatchStatus.Playable);
  });

  it('should generate single elimination bracket with 7 participants', () => {
    const participants: Participant[] = Array.from({ length: 7 }, (_, i) => ({
      id: (i + 1).toString(),
      name: `Player ${i + 1}`,
      elo: 2000 - i * 50,
    }));

    const bracket: Round[] =
      service.generateSingleEliminationBracket(participants);

    expect(bracket).toBeDefined();
    expect(bracket.length).toBe(3); // 3 rounds for 7 participants
    expect(bracket[0].matches.length).toBe(4); // First round should have 4 matches
    expect(bracket[0].matches[0].participant1).toBe(participants[0]);
    expect(bracket[0].matches[0].participant2).toBe(null);
    expect(bracket[0].matches[0].status).toBe(MatchStatus.NotPlayable);
    expect(bracket[1].matches[0].participant1).toBe(participants[0]);
    expect(bracket[1].matches[0].status).toBe(MatchStatus.NotReady);
  });
});
