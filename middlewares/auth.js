const jwt = require('jsonwebtoken');
// const validator = require('validator');

const generateToken = (payload) => jwt.sign(payload, 'some-secret-key', { expiresIn: '7d' });

const isAuthorized = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    const err = new Error('Authorization error');
    err.statusCode = 401;
    throw err;
  }
  const token = auth.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (e) {
    const err = new Error('Authorization error - please, try again');
    err.statusCode = 401;
    return next(err);
  }
  req.user = payload;
  return next();
};

// const validateUserEmail = (req, res, next) => {
//   const { email } = req.body;
//   if (validator.isEmail(email)) {
//     return next();
//   }
//   const err = new Error('Email is not correct');
//   err.statusCode = 400;
//   return next(err);
// };

// const validateCardLink = (req, res, next) => {
//   const { link } = req.body;
//   if (validator.isURL(link)) {
//     return next();
//   }
//   const err = new Error('Link is not correct');
//   err.statusCode = 400;
//   return next(err);
// };


// const validateCardLink = (value) => {
//   if (!validator.isURL(value, { require_protocol: true })) {
//     throw new Error('Неправильный формат ссылки');
//   }
//   return value;
// };

module.exports = { generateToken, isAuthorized };
