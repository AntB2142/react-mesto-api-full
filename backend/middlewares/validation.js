const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

module.exports.idValidation = celebrate({
  params: Joi
    .object()
    .keys({
      id: Joi
        .string()
        .hex()
        .length(24),
    }),
});

module.exports.userValidation = celebrate({
  body: Joi
    .object()
    .keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom((value, helpers) => {
        if (validator.isURL(value, { require_protocol: true, disallow_auth: true })) {
          return value;
        }
        return helpers.message('Неправильная ссылка на аватар');
      }),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
});

module.exports.cardValidation = celebrate({
  body: Joi
    .object()
    .keys({
      name: Joi
        .string()
        .required()
        .min(2)
        .max(30),
      link: Joi
        .string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value, { require_protocol: true, disallow_auth: true })) {
            return value;
          }
          return helpers.message('Неправильная ссылка на картинку');
        }),
    }),
});
module.exports.userUpdateValidation = celebrate({
  body: Joi
    .object()
    .keys({
      name: Joi
        .string()
        .required()
        .min(2)
        .max(30),
      about: Joi
        .string()
        .required()
        .min(2)
        .max(30),
    }),
  headers: Joi
    .object()
    .keys({
      'content-type': Joi
        .string()
        .valid('application/json')
        .required(),
    }),
});

module.exports.avatarUpdateValidation = celebrate({
  body: Joi
    .object()
    .keys({
      avatar: Joi
        .string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value, { require_protocol: true, disallow_auth: true })) {
            return value;
          }
          return helpers.message('Неправильная ссылка на аватар');
        }),
    }),
  headers: Joi
    .object()
    .keys({
      'content-type': Joi
        .string()
        .valid('application/json')
        .required(),
    }),
});

module.exports.loginValidation = celebrate({
  body: Joi
    .object()
    .keys({
      email: Joi
        .string()
        .required()
        .email(),
      password: Joi
        .string()
        .required()
        .min(8),
    }),
});
