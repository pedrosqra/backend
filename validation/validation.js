//VALIDATION
const Joi = require("@hapi/joi");

//Register validation
const register = Joi.object({
  nickname: Joi.string().min(6).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(8).required(),
});

const login = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(8).required(),
});

module.exports = {
  register,
  login,
};
