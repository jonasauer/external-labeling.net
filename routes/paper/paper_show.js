const express = require('express');
const router = express.Router('mongoose');
const Paper = require('../../model/paper');
const Cite = require("citation-js");


router.get('/:id', function(req, res, next) {

    Paper.findById(req.params.id).then(function(doc) {
        if(!doc){
            req.flash("danger", "An error occurred while showing the paper");
            res.redirect('/');
        }else{

            //todo: this should be done on the client side, however, citation-js does not seem to work properly in the browser
            const citation = new Cite(doc.bibtex);
            const paper_info = citation.format('bibliography', {
                format: 'html',
                template: 'apa',
                lang: 'en-US'
            });

            const bibjson = citation.get({type: "json"})[0];


            res.render('paper/paper_show', {
                paper: doc,
                categories: global.config.filters,
                paper_info: paper_info,
                authors: bibjson.author,
                bibtex_text: citation.format("bibtex"),
                ris_text: citation.format("ris")
            });
        }
    });
});


module.exports = router;
