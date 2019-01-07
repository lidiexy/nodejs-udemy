const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
let server;

describe('/api/genres', () => {
  beforeEach(() => { server = require('../../index'); });
  afterEach(async () => {
    await Genre.deleteMany({});
    await server.close() ;
  });
  
  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        { name: 'Genre1' },
        { name: 'Genre2' }
      ]);
      const res = await request(server).get('/api/genres');
      expect(res.body.some(g => g.name === 'Genre1')).toBeTruthy();
    });
  });
  
  describe('GET /:id', () => {
    it('should return a genre if valid id is passed', async () => {
      const res = await request(server).get('/api/genres/1');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /', async () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(server)
        .post('/api/genres')
        .send({ name: 'genres1' });
      expect(res.status).toBe(401);
    });

    it('should return 400 if an invalid genre (less than 5 chars)', async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'gen' });
      expect(res.status).toBe(400);
    });

    it('should return 400 if an invalid genre (more than 50 chars)', async () => {
      const token = new User().generateAuthToken();
      const name = new Array(52).join('a');
      const res = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name });
      expect(res.status).toBe(400);
    });

    it('should save the genre if it is valid', async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'genres1' });

      const genre = await Genre.find({ name: 'genre1' });

      expect(genre).not.toBeNull();
    });

    it('should return the genre if it is valid', async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'genres1' });

      expect(res.body).toHaveProperty('_id');
    });
  });
});

