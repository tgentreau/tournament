import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TournamentModule } from '../tournament.module';
import { TournamentPhaseType } from '../../models/models';
import { TournamentStatus } from '../entities/tournament.entity';

describe('Phase', () => {
  let app: INestApplication;
  let tournamentId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TournamentModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('201 /POST phase', async () => {
    const req = request(app.getHttpServer()).post('/tournament').send({
      name: 'Tournament 1',
    });
    const requestAsResponse = await req;
    tournamentId = requestAsResponse.text;
    request(app.getHttpServer())
      .post(`/tournament/${tournamentId}/phase`)
      .send({
        type: TournamentPhaseType.SingleBracketElimination,
      })
      .expect(201);
  });
  it('400 /POST phase tournois inexistant', async () => {
    request(app.getHttpServer())
      .post(`/tournament/123456/phase`)
      .send({
        type: TournamentPhaseType.SingleBracketElimination,
      })
      .expect(400);
  });
  it('400 /POST phase type de phase inexistant', async () => {
    request(app.getHttpServer())
      .post(`/tournament/${tournamentId}/phase`)
      .send({
        type: 'truc',
      })
      .expect(400);
  });
  it('400 /POST phase type de phase non pertinant', async () => {
    request(app.getHttpServer())
      .post(`/tournament/${tournamentId}/phase`)
      .send({
        type: TournamentPhaseType.SingleBracketElimination,
      });
    request(app.getHttpServer())
      .post(`/tournament/${tournamentId}/phase`)
      .send({
        type: TournamentPhaseType.SwissRound,
      })
      .expect(400);
  });
  it('400 /POST phase tournoi déjà démarré', async () => {
    request(app.getHttpServer())
      .patch('/tournament/' + tournamentId)
      .send({
        status: TournamentStatus.STARTED,
      });
    request(app.getHttpServer())
      .post(`/tournament/${tournamentId}/phase`)
      .send({
        type: TournamentPhaseType.SingleBracketElimination,
      })
      .expect(400);
  });
  it('400 /POST phase type de phase inexistant', async () => {
    request(app.getHttpServer())
      .post(`/tournament/${tournamentId}/phase`)
      .send({
        type: 'truc',
      })
      .expect(400);
  });
});
