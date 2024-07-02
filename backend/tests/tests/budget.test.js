const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const Budget = require('../models/Budget');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/default');

describe('Budget API', () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testDB', { useNewUrlParser: true, useUnifiedTopology: true });
    const user = new User({ username: 'testuser', password: await bcrypt.hash('password123', 10) });
    await user.save();
    token = jwt.sign({ userId: user._id, role: user.role }, config.secretOrKey);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Budget.deleteMany({});
  });

  it('should add income', async () => {
    const res = await request(app)
      .post('/api/budget/income')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 1000, source: 'Salary', date: new Date() });
    expect(res.statusCode).toBe(200);
    const budget = await Budget.findOne({ userId: jwt.verify(token, config.secretOrKey).userId });
    expect(budget.income.length).toBe(1);
  });

  it('should add expense', async () => {
    const res = await request(app)
      .post('/api/budget/expense')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 100, category: 'Groceries', date: new Date() });
    expect(res.statusCode).toBe(200);
    const budget = await Budget.findOne({ userId: jwt.verify(token, config.secretOrKey).userId });
    expect(budget.expenses.length).toBe(1);
  });

  it('should get budget report', async () => {
    await new Budget({
      userId: jwt.verify(token, config.secretOrKey).userId,
      income: [{ amount: 1000, source: 'Salary', date: new Date() }],
      expenses: [{ amount: 100, category: 'Groceries', date: new Date() }]
    }).save();
    const res = await request(app)
      .get('/api/budget/report')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.income.length).toBe(1);
    expect(res.body.expenses.length).toBe(1);
  });
});
