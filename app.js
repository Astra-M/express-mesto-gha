const express = require('express');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;

app.listen(PORT);

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '628928c4ada827f1208f48f8',
  };
  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (_, res) => res.status(404).send({ message: 'Error 404: page not found' }));
