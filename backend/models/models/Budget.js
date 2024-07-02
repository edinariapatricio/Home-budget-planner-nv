const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Budget', budgetSchema);
