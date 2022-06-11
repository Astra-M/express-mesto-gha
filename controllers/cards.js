const Card = require('../models/card');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        const err = new Error('Cards not found');
        err.statusCode = 404;
        throw err;
      }
      res.status(200).send(cards);
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new Error('Name or link are not correct');
        error.statusCode = 400;
        throw error;
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        const err = new Error('Card not found');
        err.statusCode = 404;
        throw err;
      }
      const cardOwner = card.owner.toString();
      if (cardOwner !== req.user.id) {
        const err = new Error('You are not allowed to delete another users cards');
        err.statusCode = 403;
        throw err;
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.status(200).send({ message: 'Card has been deleted' }));
    })
    .catch((err) => {
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const err = new Error('Card not found');
        err.statusCode = 404;
        throw err;
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const err = new Error('Card not found');
        err.statusCode = 404;
        throw err;
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
