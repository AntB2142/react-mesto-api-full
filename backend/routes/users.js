const express = require('express');

const routes = express.Router();

const {
  idValidation,
  userUpdateValidation,
  avatarUpdateValidation,
} = require('../middlewares/validation');
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

routes.get('/', getUsers);
routes.get('/me', idValidation, getCurrentUser);
routes.get('/:id', idValidation, getUserById);
routes.patch('/me', userUpdateValidation, updateUser);
routes.patch('/me/avatar', avatarUpdateValidation, updateAvatar);

module.exports = routes;
