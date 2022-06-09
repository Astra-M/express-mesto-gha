const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  updateUserProfile,
  updateUserAvatar,
  getUserProfile,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getUserProfile);
userRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUser);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserProfile);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/(https?:\/\/)(w{3}\.)?[A-z0-9.-]+[.A-z][/\w]*[.A-z]*#?/),
  }),
}), updateUserAvatar);

module.exports = { userRouter };
// avatar: Joi.string().pattern(/(https?:\/\/)(w{3}\.)?(\d+-)?([A-z0-9]+)(-[A-z]+){0,3}\.([A-z]{2,})(\/[A-z0-9\-\.\/_~:?#\[\]@!$&'\(\)*\+,;=]+\/#?){0,3}/)