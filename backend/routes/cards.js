const express = require('express');

const routes = express.Router();
const {
  idValidation,
  cardValidation,
} = require('../middlewares/validation');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

routes.get('/', getCards);
routes.post('/', cardValidation, createCard);
routes.delete('/:id', idValidation, deleteCard);
routes.put('/:id/likes', idValidation, likeCard);
routes.delete('/:id/likes', idValidation, dislikeCard);

module.exports = routes;
