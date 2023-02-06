var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var router = express.Router();
var userRepository = require('../repository/userRepository');
var initializePassport = require('../config/passport');

/**
 * Initialization of passport js
 */
initializePassport(async function verify(email, password, done) {
    try {
        let data = await userRepository.findUserEmailAndPassword(email, password); 
        console.log(`auth - passport verfication - data extracted: ${data.email}`);
        if (data == null) {
            done(err);
        }
        crypto.pbkdf2(password, data.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
            if (err) { return cb(err); }
            if (!crypto.timingSafeEqual(data.password, hashedPassword)) {
            return done(null, false, { message: 'Incorrect username or password.' });
            }
            console.log('auth - passport verfication success! -  ' + data);
            return done(null, data);
        });
    } catch (err) {
        console.error(`Errore durante l'estrazione degli utenti da db: `, err.message);
        done(null, false, {message: err.message});
    }
});

/* GET login. */
router.get('/login', async function(req, res, next) {
    try {
      res.send({
        message: 'Home page!',
        csrfToken: req.csrfToken()
    });
    } catch (err) {
        console.error(`Errore durante l'estrazione degli utenti da db: `, err.message);
        next(err);
    }
});

/* POST /login/password
 *
 * This route authenticates the user by verifying a username and password.
 *
 * A username and password are submitted to this route via an HTML form, which
 * was rendered by the `GET /login` route.  The username and password is
 * authenticated using the `local` strategy.  The strategy will parse the
 * username and password from the request and call the `verify` function.
 *
 * Upon successful authentication, a login session will be established.  As the
 * user interacts with the app, by clicking links and submitting forms, the
 * subsequent requests will be authenticated by verifying the session.
 *
 * When authentication fails, the user will be re-prompted to login and shown
 * a message informing them of what went wrong.
 */
router.post('/login/password', passport.authenticate('local', {
    successReturnToOrRedirect: '/home',
    failureRedirect: '/login',
    failureMessage: true
}));

/* POST /logout
 *
 * This route logs the user out.
 */
router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

/* POST /signup
 *
 * This route creates a new user account.
 *
 * A desired username and password are submitted to this route via an HTML form,
 * which was rendered by the `GET /signup` route.  The password is hashed and
 * then a new user record is inserted into the database.  If the record is
 * successfully created, the user is logged in.
 */
router.post('/signup', function(req, res, next) {
    var salt = crypto.randomBytes(16);
    console.log (`Signup method: ${req.body.email} - ${req.body.password} - ${salt}`)
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) {
            next(err);
        }
        console.log(`hashed password: ${hashedPassword} - ${salt}`)
        const createdUser = userRepository.saveUser({
            email: req.body.email,
            password: hashedPassword,
            salt: salt
        });
        console.log('user created:' + createdUser);
        req.login(createdUser, function() {
            if (err) {
                next(err);
            }
            res.redirect('/');
        })
    });
});

/* home page. */
router.get('/home', function(req, res, next) {
    res.send('home page! Logged in')
});

/* home page. */
router.get('/application', function(req, res, next) {
    res.send('application page!')
});


module.exports = router;