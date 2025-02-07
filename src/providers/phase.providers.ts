import { DataSource } from 'typeorm';
import { Phase } from '../entities/phase.entity';

export const phaseProviders = [
  {
    provide: 'PHASE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Phase),
    inject: ['DATA_SOURCE'],
  },
];
