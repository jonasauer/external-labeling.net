const express = require('express');
const router = express.Router('mongoose');
const User = require('../model/user');



router.get('/',  function(req, res, next) {

    User.find().then(function(doc){
        if(!doc)
            req.flash("danger", "Failed to load team members.");
        res.render('about', {users: doc});
    });

});

module.exports = router;
