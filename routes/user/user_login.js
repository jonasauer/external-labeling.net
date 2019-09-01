const express = require('express');
const router = express.Router('mongoose');
const passport = require('passport');

router.get('/', function(req, res){
    return res.render('user/user_login');
});


router.post('/', function(req, res, next){
    passport.authenticate('local', {
        successRedirect: '/user',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});


module.exports = router;
