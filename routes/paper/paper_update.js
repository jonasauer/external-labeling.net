const express = require('express');
const router = express.Router('mongoose');
const Paper = require('../../model/paper');
const upload = require('../../validation/file/image_validation');
const { check, validationResult } = require('express-validator');
const paper_update_validation = require('../../validation/paper/paper_update_validation');
const ensureAuthenticated = require('../../validation/authentication/authentication_validation');



router.get('/:id', ensureAuthenticated, function(req, res, next) {

    Paper.findById(req.params.id, function(err, doc){
        if(err || !doc){
            req.flash("danger", "An error occurred while updating the paper");
            res.redirect('/');
        }else{
            res.render('paper/paper_update', {
                categories: global.config.filters,
                bibtex_types: global.config.bibtex_types,
                fill_form: doc
            });
        }
    });
});


router.post('/', ensureAuthenticated, upload.single('file'), paper_update_validation, async function(req, res, next) {

    res.locals.errors = validationResult(req);
    if(!res.locals.errors.isEmpty()) {
        const fill_form = req.body;
        fill_form.image_path = "";
        fill_form.clear_image = false;
        fill_form.filters = JSON.parse(fill_form.filters);
        return res.render("paper/paper_update", {
            categories: global.config.filters,
            bibtex_types: global.config.bibtex_types,
            fill_form: fill_form
        });
    }

    //request paper from database
    let paper = null;
    await Paper.findById(req.body._id, function (err, doc) {
        if (err || !doc)
            req.flash("danger", "An error occurred while updating the paper");
        paper = doc;
    }).exec();

    if(!paper){
        return res.redirect("/");
    }


    //save paper
    paper.title = req.body.title;
    paper.year = req.body.year;
    paper.authors = req.body.authors;
    paper.doi = req.body.doi;
    paper.dblp = req.body.dblp;
    paper.bibtex = req.body.bibtex;
    paper.filters = JSON.parse(req.body.filters);
    if (req.file)
        paper.image_path = req.file.filename;
    else if (req.body.clear_image)
        paper.image_path = "/images/paper.png";

    paper.save(function(err, doc){
        if(err || !doc) {
            req.flash("danger", "An error occurred while updating the paper");
            const fill_form = req.body;
            fill_form.image_path = "";
            fill_form.clear_image = false;
            fill_form.filters = JSON.parse(fill_form.filters);
            return res.render("paper/paper_update", {
                categories: global.config.filters,
                bibtex_types: global.config.bibtex_types,
                fill_form: fill_form
            });
        } else {
            req.flash("success", "Paper updated successfully");
            return res.redirect('/');
        }
    });
});

module.exports = router;
