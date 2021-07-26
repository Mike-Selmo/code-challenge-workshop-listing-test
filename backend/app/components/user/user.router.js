const express = require('express');
const router = express.Router();


const userController = require('./user.controller');

module.exports = (auth) => {
  router.post('/sign-up', userController.signUpHandler);
  router.post('/sign-in', userController.signInHandler);

  router.post('/workshops/liked/:id', auth, userController.addToLikedHandler);
  router.delete('/workshops/liked/:id', auth, userController.removeFromLikedHandler);
  router.post('/workshops/disliked/:id', auth, userController.addToDislikedHandler);

  return router;
};
