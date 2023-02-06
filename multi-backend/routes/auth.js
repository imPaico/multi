var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var router = express.Router();
var userRepository = require('../repository/userRepository');

/* Configure password authentication strategy.
 *
 * The `LocalStrategy` authenticates users by verifying a username and password.
 * The strategy parses the username and password from the request and calls the
 * `verify` function.
 *
 * The `verify` function queries the database for the user record and verifies
 * the password by hashing the password supplied by the user and comparing it to
 * the hashed password stored in the database.  If the comparison succeeds, the
 * user is authenticated; otherwise, not.
 */
passport.use(new LocalStrategy({usernameField: "email"},
    async function verify(email, password, done) {
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
}));

/* Configure session management.
 *
 * When a login session is established, information about the user will be
 * stored in the session.  This information is supplied by the `serializeUser`
 * function, which is yielding the user ID and username.
 *
 * As the user interacts with the app, subsequent requests will be authenticated
 * by verifying the session.  The same user information that was serialized at
 * session establishment will be restored when the session is authenticated by
 * the `deserializeUser` function.
 *
 * Since every request to the app needs the user ID and username, in order to
 * fetch todo records and render the user element in the navigation bar, that
 * information is stored in the session.
 */
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        console.log(`serializing user: ${user}`);
      cb(null, { id: user.id, username: user.username });
    });
  });
  
passport.deserializeUser(function(user, cb) {
    console.log(`deserializing user: ${user.email}, ${user.password}`);
    process.nextTick(function() {
        return cb(null, user);
    });
});

/* GET home page. */
router.get('/login', async function(req, res, next) {
    try {
      //res.json(await userRepository.getUsers(1)); 
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

/* GET home page. */
router.get('/home', function(req, res, next) {
    res.send('home page! Logged in')
});

module.exports = router;