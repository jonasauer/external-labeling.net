const express = require('express');
const router = express.Router('mongoose');
const User = require('../../model/user');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const user_update_account_validation = require('../../validation/user/user_update_account_validation');
const user_update_password_validation = require('../../validation/user/user_update_password_validation');
const ensureAuthenticated = require('../../validation/authentication/authentication_validation');



router.get('/password', ensureAuthenticated, function(req, res){

    res.render("user/user_update_password", {fill_form: req.user});
});


router.post('/password', ensureAuthenticated, user_update_password_validation, async function(req, res){

    res.locals.errors = validationResult(req);
    if(!res.locals.errors.isEmpty()) {
        const fill_form = req.body;
        return res.render("user/user_update_password", {fill_form: fill_form});
    }


    //request user from database
    let user = null;
    await User.findById(req.body._id, function (err, doc) {
        if (err || !doc)
            req.flash("danger", "An error occurred while updating your password");
        user = doc;
    }).exec();

    if(!user){
        return res.render("user/user_update_password");
    }


    //save user
    let salt = bcrypt.genSaltSync(16);
    user.password = bcrypt.hashSync(req.body.password, salt);

    user.save(function(err, doc){
        if(err || !doc) {
            req.flash("danger", "An error occurred while updating your password");
            const fill_form = req.body;
            return res.render("user/user_update_password", {fill_form: fill_form});
        } else {
            req.flash("success", "Password updated successfully");
            return res.redirect('/user');
        }
    });
});






router.get('/account', ensureAuthenticated, function(req, res){

    res.render("user/user_update_account", {fill_form: req.user});
});

router.post('/account', ensureAuthenticated, user_update_account_validation, async function(req, res){

    console.error(req.body);

    res.locals.errors = validationResult(req);
    if(!res.locals.errors.isEmpty()) {
        const fill_form = req.body;
        return res.render("user/user_update_account", {fill_form: fill_form});
    }

    //request user from database
    let user = null;
    await User.findById(req.body._id, function (err, doc) {
        if (err || !doc)
            req.flash("danger", "An error occurred while updating your account");
        user = doc;
    }).exec();

    if(!user){
        return res.render("user/user_update_account");
    }


    //save user
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.username = req.body.username;

    user.save(function(err, doc){
        if(err || !doc) {
            req.flash("danger", "An error occurred while updating your account");
            const fill_form = req.body;
            return res.render("user/user_update_account", {fill_form: fill_form});
        } else {
            req.flash("success", "Account updated successfully");
            return res.redirect('/user');
        }
    });
});

module.exports = router;
