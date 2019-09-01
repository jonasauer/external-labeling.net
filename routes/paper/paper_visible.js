const express = require('express');
const router = express.Router('mongoose');
const Paper = require('../../model/paper');
const ensureAuthenticated = require('../../validation/authentication/authentication_validation');



router.get('/:id', ensureAuthenticated, async function(req, res) {

    //requesting the paper
    let paper = null;
    await Paper.findById(req.params.id, function (err, doc) {
        if(err || !doc)
            req.flash("danger", "An error occurred while changing the paper visibility");
        paper = doc;
    }).exec();

    if(!paper){
        return res.redirect("/");
    }


    //saving the updated paper
    paper.visible = !paper.visible;

    paper.save(function(err, doc){
        if(err || !doc) {
            req.flash("danger", "An error occurred");
        } else {
            req.flash("success", "Paper visibility switched successful!");
        }
        return res.redirect('/');
    });
});

module.exports = router;
