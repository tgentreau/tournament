import { Test, TestingModule } from '@nestjs/testing';
import { SingleEliminationBracketCreatorService } from './singleEliminationBracketCreator.service';
import { TournamentRepository } from './tournament.repository';
import { Participant } from '../models/models';
import { Tournament } from './entities/tournament.entity';
import { TournamentPhase } from './entities/tournamentPhase.entity';

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
    const participants: Participant[] = [
      { id: '1', name: 'Player 1', elo: 2000 },
      { id: '2', name: 'Player 2', elo: 1900 },
      { id: '3', name: 'Player 3', elo: 1800 },
      { id: '4', name: 'Player 4', elo: 1700 },
      { id: '5', name: 'Player 5', elo: 1600 },
      { id: '6', name: 'Player 6', elo: 1500 },
      { id: '7', name: 'Player 7', elo: 1400 },
      { id: '8', name: 'Player 8', elo: 1300 },
      { id: '9', name: 'Player 9', elo: 1200 },
      { id: '10', name: 'Player 10', elo: 1100 },
      { id: '11', name: 'Player 11', elo: 1000 },
      { id: '12', name: 'Player 12', elo: 900 },
      { id: '13', name: 'Player 13', elo: 800 },
      { id: '14', name: 'Player 14', elo: 700 },
      { id: '15', name: 'Player 15', elo: 600 },
      { id: '16', name: 'Player 16', elo: 500 },
    ];

    tournament.participants = participants;

    jest.spyOn(repository, 'getParticipants').mockReturnValue(participants);

    const bracket = service.generateSingleEliminationBracket(tournament);

    expect(bracket).toBeDefined();
  });
});
