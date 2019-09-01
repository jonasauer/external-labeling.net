const express = require('express');
const router = express.Router('mongoose');
const Paper = require('../../model/paper');



router.get('/', function(req, res, next) {

    Paper.find().sort({year: -1}).then(function(doc) {
        if(!doc)
            req.flash("danger", "Failed to request paper entries");

        res.render('paper/paper', {
            categories: global.config.filters,
            bibtex_types: global.config.bibtex_types,
            papers: doc
        });
    });
});


module.exports = router;
