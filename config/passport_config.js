const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const passport_config = require('passport');


passport_config.use(new LocalStrategy(function (username, password, done) {
    User.findOne({username: username}, function (err, user) {
        if (err)
            return done(err);

        if (!user)
            return done(null, false, {message: "No user found"});

        //match password
        bcrypt.compare(password, user.password, function (err, matched) {
            if (err)
                return done(null, false, {message: "Could not log in"});
            if (matched) {
                return done(null, user);
            } else {
                return done(null, false, {message: "Wrong password"});
            }
        });

    });
}));

passport_config.serializeUser(function (user, done) {
    done(null, user._id);
});

passport_config.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
