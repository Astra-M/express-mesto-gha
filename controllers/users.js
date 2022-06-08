const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken } = require('../middlewares/auth');

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const err = new Error('Email or password are not correct');
        err.statusCode = 400;
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
      // return res.status(200).send(user);
    })
    .catch((err) => {
      //должен валидировать джой
      if (err.kind === 'ObjectId') {
        const error = new Error('Id is not correct');
        error.statusCode = 400;
        return next(error);
      }
      // next(err);
      return next(err);
    });
};

const createUser = (req, res, next) => {
  // const {
  //   name, about, avatar, email, password,
  // } = req.body;
  const {
    name: username,
    about: userProf,
    avatar: userAvatar,
    email: userEmail,
    password: userPassword,
  } = req.body;
  // if (!email || !password) {
  if (!userEmail || !userPassword) {
    const err = new Error('Email and password are required');
    err.statusCode = 400;
    throw err;
  }
  bcrypt.hash(userPassword, 10)
    .then((hash) => {
      User.create({
        name: username,
        about: userProf,
        avatar: userAvatar,
        email: userEmail,
        password: hash,
      })
  // bcrypt.hash(password, 10)
  //   .then((hash) => {
  //     User.create({
  //       name,
  //       about,
  //       avatar,
  //       email,
  //       password: hash,
  //     })
        // .then((user) => {
        //   return res.status(201).send(user);
        // })
        // .then(() => { throw new Error() })
        // .then((user) => res.status(201).send(user))
        .then((user) => {
          // const { name, email, about, avatar, _id, __v } = user;
          const {
            _id, __v, name, email, about, avatar,
          } = user;
          res.status(201);
          res.send({
            name, email, about, avatar, _id, __v,
          });
        })

        .catch((e) => {
          if (e.code === 11000) {
            const duplicateError = new Error('This email already exists');
            duplicateError.statusCode = 409;
            return next(duplicateError);
          }
          return next(e);
        });
    });
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
