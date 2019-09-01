const express = require('express');
const router = express.Router('mongoose');
const Paper = require('../../model/paper');
const ensureAuthenticated = require('../../validation/authentication/authentication_validation');



router.get('/:id', ensureAuthenticated, function(req, res) {

    Paper.remove({_id: req.params.id}, function(err, doc){
        if(err || !doc) {
            req.flash("danger", "An error occurred while deleting the paper");
        }else{
            req.flash("success", "Paper removed successfully");
        }
        res.redirect('/');
    });
});

module.exports = router;
