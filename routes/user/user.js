const express = require('express');
const router = express.Router('mongoose');
const User = require('../../model/user');
const ensureAuthenticated = require('../../validation/authentication/authentication_validation');


router.get('/', ensureAuthenticated, function(req, res){

    User.find().sort({username: 1}).then(function(doc) {
        if(!doc)
            req.flash("danger", "Failed to request paper entries");

        res.render('user/user', {
            users: doc
        });
    });
});


module.exports = router;
