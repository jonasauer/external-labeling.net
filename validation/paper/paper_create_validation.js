const Cite = require('citation-js');
const { check, validationResult } = require('express-validator');

const validation = [
    check("title").exists().not().isEmpty().withMessage("Title is required"),
    check("year").exists().not().isEmpty().withMessage("Year is required"),
    check("year").exists().isInt().withMessage("Year has to be a valid year"),
    check("authors").exists().not().isEmpty().withMessage("Authors are required"),
    check("bibtex").exists().not().isEmpty().withMessage("BibTeX is required"),
    check("bibtex").custom(value => {
        try{
            new Cite(value);
        }catch (e) {
            throw new Error();
        }
        return true;
    }).withMessage("BibTeX is not valid"),
    check("filters").custom(value => {
        try{
            JSON.parse(value);
        }catch (e) {
            throw new Error();
        }
        return true;
    }).withMessage("Something went wrong while storing the filter options")
];

module.exports = validation;