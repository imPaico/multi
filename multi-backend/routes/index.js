var express = require('express');
var userService = require('../service/userService');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    //res.json(await userRepository.getUsers(1));
    let data = await userService.getUsers(1); 
    console.log('index.js - data extracted: ' + data);
    res.send(data);
  } catch (err) {
      console.error(`Errore durante l'estrazione degli utenti da db: `, err.message);
      next(err);
  }
});


module.exports = router;
