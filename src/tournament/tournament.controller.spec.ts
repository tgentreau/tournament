import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TournamentModule } from './tournament.module';

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
      .expect(200)
  });

  it('404 /GET tournament', async () => {
    request(app.getHttpServer())
      .get(`/tournament/123456`)
      .expect(404)
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
      .expect(400)
  });

  it('400 /POST tournament name already exist', async () => {
    request(app.getHttpServer())
      .post('/tournament')
      .send({
        name: 'Tournament 1',
      })
      .expect(400);
  });
});

describe('Participant', () => {
  let app: INestApplication;
  let participantId: string;
  let tournamentId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TournamentModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('201 /POST participant', async () => {
    const reqAvant = request(app.getHttpServer()).post('/tournament').send({
      name: 'Tournament 1',
    });
    const requestAsResponseAvant = await reqAvant;
    tournamentId = requestAsResponseAvant.text;
    const req = request(app.getHttpServer())
      .post(`/tournament/${tournamentId}/participants`)
      .send({
        name: 'Participant 1',
        elo: 1000,
      })
      .expect(201);
    const requestAsResponse = await req;
    participantId = requestAsResponse.text;
  });

  it('400 /POST participant name missing', async () => {
    const req = request(app.getHttpServer())
      .post(`/tournament/${tournamentId}/participants`)
      .send({
        name: '',
        elo: 1000,
      })
      .expect(400);
    const requestAsResponse = await req;
    participantId = requestAsResponse.text;
  });

  it('400 /POST participant elo missing', async () => {
    const req = request(app.getHttpServer())
      .post(`/tournament/${tournamentId}/participants`)
      .send({
        name: 'Participant 1',
        elo: '',
      })
      .expect(400);
    const requestAsResponse = await req;
    participantId = requestAsResponse.text;
  });

  it('400 /POST participant name already exist', async () => {
    request(app.getHttpServer())
      .post('/participant')
      .send({
        name: 'Participant 1',
      })
      .expect(400);
  });

  it('200 /GET participant', async () => {
    request(app.getHttpServer())
      .get(`/tournament/${tournamentId}/participants`)
      .expect(200);
  });

  it('200 /GET participant/:id', async () => {
    request(app.getHttpServer())
      .get(`/tournament/${tournamentId}/participants/${participantId}`)
      .expect(200);
  });

  it('404 /GET participant/:id', async () => {
    request(app.getHttpServer())
      .get(`/tournament/${tournamentId}/participants/123`)
      .expect(404);
  });

  it('200 /DELETE participant/:id', async () => {
    request(app.getHttpServer())
      .delete(`/tournament/${tournamentId}/participants/${participantId}`)
      .expect(200);
  });

  it('404 /DELETE participant/:id', async () => {
    request(app.getHttpServer())
      .delete(`/tournament/${tournamentId}/participants/123`)
      .expect(404);
  });

  it('201 /POST too much participant in the tournament', async () => {
    const reqAvant = request(app.getHttpServer()).post('/tournament').send({
      name: 'Tournament A',
      maxParticipants: 1,
    });
    const requestAsResponseAvant = await reqAvant;
    tournamentId = requestAsResponseAvant.text;
    const req = request(app.getHttpServer())
      .post(`/tournament/${tournamentId}/participants`)
      .send({
        name: 'Participant 2',
        elo: 1000,
      })
      .expect(201);
    const requestAsResponse = await req;
    participantId = requestAsResponse.text;
    request(app.getHttpServer())
      .post(`/tournament/${tournamentId}/participants`)
      .send({
        name: 'Participant 3',
        elo: 1000,
      })
      .expect(400);
  });
});
