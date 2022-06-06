const Card = require('../models/card');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
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
    .then((user) => res.status(201).send(user))
    .catch((err) => {
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
        const err = new Error('Authorization error: you are not allowed to delete another users cards');
        err.statusCode = 401;
        throw err;
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => {
          return res.status(200).send({ message: 'Card has been deleted' });
        });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        const error = new Error('Id is not correct');
        error.statusCode = 400;
        return next(error);
      }
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
      if (err.kind === 'ObjectId') {
        const error = new Error('Id is not correct');
        error.statusCode = 400;
        return next(error);
      }
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
      if (err.kind === 'ObjectId') {
        const error = new Error('Id is not correct');
        error.statusCode = 400;
        return next(error);
      }
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
