const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('User API', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testDB', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should register a user', async () => {
    const res = await request(app).post('/api/users/register').send({
      username: 'testuser',
      password: 'password123'
    });
    expect(res.statusCode).toBe(201);
  });

  it('should login a user', async () => {
    await request(app).post('/api/users/register').send({
      username: 'testuser',
      password: 'password123'
    });
    const res = await request(app).post('/api/users/login').send({
      username: 'testuser',
      password: 'password123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
