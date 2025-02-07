import { DataSource } from 'typeorm';
import { Participant } from '../../entities/participant.entity';

export const participantProviders = [
  {
    provide: 'PARTICIPANT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Participant),
    inject: ['DATA_SOURCE'],
  },
];
