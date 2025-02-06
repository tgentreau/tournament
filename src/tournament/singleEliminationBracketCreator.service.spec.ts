import { Test, TestingModule } from '@nestjs/testing';
import { TournamentRepository } from './tournament.repository';
import { Participant } from '../models/models';
import { Tournament } from './entities/tournament.entity';
import { TournamentPhase } from './entities/tournamentPhase.entity';
import { SingleEliminationBracketCreatorService } from './singleEliminationBracketCreator.service';

describe('SingleEliminationBracketCreatorService', () => {
  let service: SingleEliminationBracketCreatorService;
  let repository: TournamentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SingleEliminationBracketCreatorService,
        {
          provide: TournamentRepository,
          useValue: {
            getParticipants: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SingleEliminationBracketCreatorService>(
      SingleEliminationBracketCreatorService,
    );
    repository = module.get<TournamentRepository>(TournamentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a single elimination bracket', () => {
    const tournament: Tournament = {
      currentParticipantNb: 0,
      phases: [],
      status: '',
      addPhase(phaseType: TournamentPhase): void {},
      id: '1',
      name: 'Test Tournament',
      participants: [],
    };
    const participants: Participant[] = Array.from({ length: 30 }, (_, i) => ({
      id: (i + 1).toString(),
      name: `Player ${i + 1}`,
      elo: 2000 - i * 50,
    }));

    tournament.participants = participants;

    jest.spyOn(repository, 'getParticipants').mockReturnValue(participants);

    const bracket = service.generateSingleEliminationBracket(tournament);

    expect(bracket).toBeDefined();
  });
});
