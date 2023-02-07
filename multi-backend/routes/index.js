var express = require('express');
var userService = require('../service/userService');
var router = express.Router();

/* GET home page. */
router.get('/', checkAuthenticated, async function(req, res, next) {
  res.send(`Hi! this is the main page! Welcome ${req.user.email}`)
});

/* GET home page. */
router.get('/users/:id', checkAuthenticated, async function(req, res, next) {
  try {
    let data = await userService.findById(req.params.id); 
    res.send(data);
  } catch (err) {
      console.error(`Errore durante l'estrazione degli utenti da db: `, err.message);
      next(err);
  }
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/')
  }
  next()
}

module.exports = router;
