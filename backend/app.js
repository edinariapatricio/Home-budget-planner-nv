const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const budgetRoutes = require('./routes/budget');
const config = require('./config/default');

const app = express();

mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/budget', budgetRoutes);

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
