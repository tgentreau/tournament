import { DataSource } from 'typeorm';
import { Tournament } from '../entities/tournament.entity';

export const tournamentProviders = [
  {
    provide: 'TOURNAMENT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Tournament),
    inject: ['DATA_SOURCE'],
  },
];
