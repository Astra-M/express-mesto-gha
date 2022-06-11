const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken } = require('../middlewares/auth');

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const err = new Error('Email or password are not correct');
        err.statusCode = 401;
        throw err;
      }
      const isPasswordValid = bcrypt.compare(password, user.password);
      return Promise.all([isPasswordValid, user]);
    })
    .then(([isPasswordValid, user]) => {
      if (!isPasswordValid) {
        const err = new Error('Email or password are not correct');
        err.statusCode = 401;
        throw err;
      }
      return generateToken({ id: user._id });
    })
    .then((token) => res.status(200).send({ token }))
    .catch((err) => {
      next(err);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};

const getUserProfile = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      next(err);
    });
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
      }
      const {
        _id, __v, name, email, about, avatar,
      } = user;
      res.status(200);
      res.send({
        name, email, about, avatar, _id, __v,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name: username,
    about: userProf,
    avatar: userAvatar,
    email: userEmail,
    password: userPassword,
  } = req.body;
  bcrypt.hash(userPassword, 10)
    .then((hash) => {
      User.create({
        name: username,
        about: userProf,
        avatar: userAvatar,
        email: userEmail,
        password: hash,
      })
        .then((user) => {
          const {
            _id, __v, name, email, about, avatar,
          } = user;
          res.status(201);
          res.send({
            name, email, about, avatar, _id, __v,
          });
        })
        .catch((e) => {
          if (e.name === 'ValidationError') {
            const error = new Error('Some of the fields are not correct');
            error.statusCode = 400;
            throw error;
          }
          if (e.code === 11000) {
            const duplicateError = new Error('This email already exists');
            duplicateError.statusCode = 409;
            return next(duplicateError);
          }
          return next(e);
        });
    })
    .catch((err) => next(err));
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user.id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user.id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
  getUserProfile,
};
