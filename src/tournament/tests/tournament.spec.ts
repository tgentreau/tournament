import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TournamentModule } from '../tournament.module';
import { TournamentStatus } from '../entities/tournament.entity';

describe('Tournament', () => {
  let app: INestApplication;
  let tournamentId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TournamentModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('200 /GET tournament', async () => {
    request(app.getHttpServer())
      .get(`/tournament/${tournamentId}`)
      .expect({
        id: tournamentId,
        name: 'Tournament 1',
        maxParticipants: null,
        currentParticipantNb: 0,
        phases: [],
        participants: [],
        status: 'Not Started',
      })
      .expect(200);
  });

  it('404 /GET tournament', async () => {
    request(app.getHttpServer()).get(`/tournament/123456`).expect(404);
  });

  it('201 /POST tournament', async () => {
    const req = request(app.getHttpServer())
      .post('/tournament')
      .send({
        name: 'Tournament 1',
      })
      .expect(201);
    const requestAsResponse = await req;
    tournamentId = requestAsResponse.text;
  });

  it('400 /POST tournament name missing', async () => {
    request(app.getHttpServer())
      .post('/tournament')
      .send({
        name: '',
      })
      .expect(400);
  });

  it('400 /POST tournament name already exist', async () => {
    request(app.getHttpServer())
      .post('/tournament')
      .send({
        name: 'Tournament 1',
      })
      .expect(400);
  });
  it('204 /PATCH start tournament', async () => {
    request(app.getHttpServer())
      .patch('/tournament/' + tournamentId)
      .send({
        status: TournamentStatus.STARTED,
      })
      .expect(204);
  });
});
