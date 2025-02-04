import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TournamentModule } from './tournament.module';

describe('TournamentController', () => {
  let app: INestApplication;
  let tournamentId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TournamentModule]
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('201 /POST tournament', async () => {
    const req = request(app.getHttpServer())
      .post('/tournament')
      .send({
        name: 'Tournament 1',
      })
      .expect(201)
      const requestAsResponse = await req;
      tournamentId = requestAsResponse.text;
  });

  it('400 /POST tournament name missing', async () => {
    const req = request(app.getHttpServer())
      .post('/tournament')
      .send({
        name: '',
      })
      .expect(400)
      const requestAsResponse = await req;
      tournamentId = requestAsResponse.text;
  });

  it('400 /POST tournament name already exist', async () => {
    const req = request(app.getHttpServer())
      .post('/tournament')
      .send({
        name: 'Tournament 1',
      })
      .expect(400)
  });

});
