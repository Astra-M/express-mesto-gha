const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(/(https?:\/\/)(w{3}\.)?(\d+-)?([A-z0-9]+)(-[A-z]+){0,3}\.([A-z]{2,})(\/[A-z0-9\-\.\/_~:?#\[\]@!$&'\(\)*\+,;=]+\/#?){0,3}/),
  }),
}), createCard);

cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports = { cardRouter };
