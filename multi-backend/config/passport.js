var passport = require('passport');
var LocalStrategy = require('passport-local');

var initializePassport = function(verify) {

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
    passport.use(new LocalStrategy({usernameField: "email"}, verify));

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
    passport.serializeUser(function(user, done) {
        process.nextTick(function() {
            done(null, {email: user.email });
        });
    });

    passport.deserializeUser(function(user, done) {
        console.log(`deserializing user: ${user.email}`);
        process.nextTick(function() {
            return done(null, user);
        });
    });
}

module.exports = initializePassport