const express = require('express');
const router = express.Router('mongoose');


router.get('/', function(req, res){
    req.logout();
    req.flash("success", "You are now logged out");
    res.redirect('/');
});


module.exports = router;
