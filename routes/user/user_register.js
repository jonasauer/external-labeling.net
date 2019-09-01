const express = require('express');
const router = express.Router('mongoose');
const mongoose = require('mongoose');
const User = require('../../model/user');
const { check, validationResult } = require('express-validator');
const user_register_validation = require('../../validation/user/user_register_validation');
const bcrypt = require('bcryptjs');
const ensureAuthenticated = require('../../validation/authentication/authentication_validation');



router.get('/', ensureAuthenticated, function(req, res){
    return res.render('user/user_register', {
        fill_form: {}
    });
});


router.post('/', ensureAuthenticated, user_register_validation, function(req, res){

    //redirect in case of validation errors
    res.locals.errors = validationResult(req);
    if(!res.locals.errors.isEmpty()) {
        const fill_form = req.body;
        return res.render("user/user_register", {fill_form: fill_form});
    }

    //hash the password
    let salt = bcrypt.genSaltSync(16);
    let hash = bcrypt.hashSync(req.body.password, salt);

    //save user
    const data = new User({
        _id: mongoose.Types.ObjectId(),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: hash
    });

    data.save(function(err, doc){
        if(err || !doc) {
            req.flash("danger", "An error occurred while registering the user");
            const fill_form = req.body;
            return res.render("user/user_register", {fill_form: fill_form});
        } else {
            req.flash("success", "User registered successful");
            return res.redirect('/user');
        }
    });
});

module.exports = router;
