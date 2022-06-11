const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
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

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('URL is not valid');
    }),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(isAuthorized);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res, next) => {
  const error = new Error('This page does not exist');
  error.statusCode = 404;
  next(error);
});

app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message || 'Something went wrong' });
  }
  res.status(500).send({ message: 'Server error' });
  return next(err);
});
