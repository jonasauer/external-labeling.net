const express = require('express');
const router = express.Router('mongoose');
const mongoose = require('mongoose');
const Paper = require('../../model/paper');
const upload = require('../../validation/file/image_validation');
const { check, validationResult } = require('express-validator');
const paper_create_validation = require('../../validation/paper/paper_create_validation');
const ensureAuthenticated = require('../../validation/authentication/authentication_validation');



router.get('/', ensureAuthenticated, function(req, res, next) {

    return res.render('paper/paper_create', {
        categories: global.config.filters,
        bibtex_types: global.config.bibtex_types,
        fill_form: {}
    });
});


router.post('/', ensureAuthenticated, upload.single('file'), paper_create_validation, async function(req, res, next) {

    res.locals.errors = validationResult(req);
    if(!res.locals.errors.isEmpty()) {
        const fill_form = req.body;
        fill_form.image_path = "";
        fill_form.clear_image = false;
        fill_form.filters = JSON.parse(fill_form.filters);
        return res.render("paper/paper_create", {
            categories: global.config.filters,
            bibtex_types: global.config.bibtex_types,
            fill_form: fill_form
        });
    }

    //save paper
    const data = new Paper({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        year: req.body.year,
        authors: req.body.authors,
        doi: req.body.doi,
        dblp: req.body.dblp,
        bibtex: req.body.bibtex,
        filters: JSON.parse(req.body.filters),
        image_path: req.file ? req.file.filename : "/images/paper.png"
    });

    data.save(function(err, doc){
        if(err || !doc) {
            req.flash("danger", "An error occurred while saving the paper");
            const fill_form = req.body;
            fill_form.image_path = "";
            fill_form.clear_image = false;
            fill_form.filters = JSON.parse(fill_form.filters);
            return res.render("paper/paper_create", {
                categories: global.config.filters,
                bibtex_types: global.config.bibtex_types,
                fill_form: fill_form
            });
        } else {
            req.flash("success", "Paper saved successfully");
            return res.redirect('/');
        }
    });
});

module.exports = router;
