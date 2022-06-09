const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);

cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

cardRouter.post('/',
celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?[A-z0-9\.\-]+[\.A-][\/\w]*[\.A-z]*#?/),
    // link: Joi.string().required().pattern(/https?:\/\/(w{3}\.)?(\d+-)?([A-z0-9]+)(-[A-z]+){0,3}\.([A-z]{2,})\/?([A-z0-9\-._~:?#[\]@!$&'()*+,;=]+\/){1,3}#?/),
  }),
}),
createCard);

cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);

cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

// cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports = { cardRouter };
