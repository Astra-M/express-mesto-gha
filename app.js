const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { isAuthorized } = require('./middlewares/auth');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;

app.listen(PORT);

app.use(express.json());

app.use('/users', isAuthorized, userRouter);
app.use('/cards', isAuthorized, cardRouter);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3).max(30),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/(https?:\/\/)(w{3}\.)?[A-z0-9.-]+[.A-z][/\w]*[.A-z]*#?/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3).max(30),
  }),
}), createUser);
app.use(errors());
app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message || 'Something went wrong' });
  }
  res.status(500).send({ message: 'Server error' });
  return next(err);
});

app.use((req, res, next) => {
  res.status(404).send({ message: 'Error 404: there is no such page' });
  next();
});
