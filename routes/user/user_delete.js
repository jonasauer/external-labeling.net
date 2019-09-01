const express = require('express');
const router = express.Router('mongoose');
const User = require('../../model/user');
const ensureAuthenticated = require('../../validation/authentication/authentication_validation');


router.get('/:id', ensureAuthenticated, function(req, res){

    User.remove({_id: req.params.id}, function(err, doc){
        if(err || !doc) {
            req.flash("danger", "An error occurred while deleting the user");
        }else{
            req.flash("success", "User removed successfully");
        }
        res.redirect('/user');
    });
});


module.exports = router;
