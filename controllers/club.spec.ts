import { Model } from 'objection';
import request from 'supertest';

import {
  createKnexClient,
  migrate,
  seed
} from '../db';
import { PER_PAGE } from '../configs/env'
import { app } from '../index';

let knex: any;
let createdClubId: number;

describe('club controller work correctly', () => {
  beforeAll(async () => {
    try {
      knex = createKnexClient();
      Model.knex(knex);
      await migrate();
      await seed();
    } catch (e) {
      console.log('Error migrating DB:', e);
    }
  })

  test('Get Clubs with all default input', async () => {
    const res = await request(app).get('/api/clubs').send();
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.per_page).toBe(PER_PAGE);
    expect(res.body.total_page).toBeGreaterThan(0);
    expect(res.body.result_count).toBe(res.body.data.length);
    expect(res.body.data[0]).toHaveProperty('name')
    expect(res.body.data[0]).toHaveProperty('code')
    expect(res.body.data[0]).toHaveProperty('country')
  })

  test('Get clubs at page 2', async () => {
    const res = await request(app).get('/api/clubs?page=2').send();
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.per_page).toBe(PER_PAGE);
    expect(res.body.total_page).toBeGreaterThan(0);
    expect(res.body.result_count).toBe(res.body.data.length);
    expect(res.body.data[0]).toHaveProperty('name')
    expect(res.body.data[0]).toHaveProperty('code')
    expect(res.body.data[0]).toHaveProperty('country')
  })
  
  test('Search club by name', async () => {
    const res = await request(app).get('/api/clubs?name=fc&page=2').send();
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.per_page).toBe(PER_PAGE);
    expect(res.body.total_page).toBeGreaterThan(0);
    expect(res.body.result_count).toBe(res.body.data.length);
    expect(res.body.data[0].name.toLowerCase()).toContain('fc');
  })
  
  test('Filter club by code', async () => {
    const res = await request(app).get('/api/clubs?code=LEE').send();
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.per_page).toBe(PER_PAGE);
    expect(res.body.total_page).toBeGreaterThan(0);
    expect(res.body.result_count).toBe(res.body.data.length);
    expect(res.body.data[0].code).toBe('LEE');
  })

  test('Get club by ID', async () => {
    const res = await request(app).get('/api/clubs/1').send();
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  })
  
  test('Get club by ID (not found)', async () => {
    const res = await request(app).get('/api/clubs/-1').send();
    expect(res.status).toBe(404);
  })

  test('Add a new club', async () => {
    const [name, code, country] = ['CLB Hai Phong', 'HPF', 'Vietnam'];
    const res = await request(app).post('/api/clubs').send({
      name,
      code,
      country
    });
    expect(res.status).toBe(201);
    createdClubId = res.body.id;
    const res2 = await request(app).get('/api/clubs/' + createdClubId);
    expect(res2.body.name).toBe(name);
    expect(res2.body.code).toBe(code);
    expect(res2.body.country).toBe(country);
  })

  test('Update a club (country only)', async () => {
    const country = 'England';
    const res = await request(app).put('/api/clubs/' + createdClubId).send({
      country
    });
    expect(res.status).toBe(201);
    const res2 = await request(app).get('/api/clubs/' + createdClubId);
    expect(res2.body.country).toBe(country);
  })

  test('Update a club (all fields)', async () => {
    const [name, code, country] = ['CLB Hai Phong FC', 'HPFC', 'Swede'];
    const res = await request(app).put('/api/clubs/' + createdClubId).send({
      name, code, country
    });
    expect(res.status).toBe(201);
    const res2 = await request(app).get('/api/clubs/' + createdClubId);
    expect(res2.body.name).toBe(name);
    expect(res2.body.code).toBe(code);
    expect(res2.body.country).toBe(country);
  })

  test('Update a club (not found)', async () => {
    const res = await request(app).put('/api/clubs/-1').send();
    expect(res.status).toBe(404);
  })

  test('Delete a club', async () => {
    const res = await request(app).del('/api/clubs/' + createdClubId).send();
    expect(res.status).toBe(201);
    const res2 = await request(app).get('/api/clubs/' + createdClubId);
    expect(res2.status).toBe(404);
  })
  
  test('Delete a club (not found)', async () => {
    const res = await request(app).get('/api/clubs/' + createdClubId).send();
    expect(res.status).toBe(404);
  })

  afterAll(() => {
    knex.destroy();
  })
})
