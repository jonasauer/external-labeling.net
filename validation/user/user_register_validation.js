const { check, validationResult } = require('express-validator');
const User = require('../../model/user');

const validation = [
    check("firstname").exists().not().isEmpty().withMessage("First name is required"),
    check("lastname").exists().not().isEmpty().withMessage("Last name is required"),

    check("email").exists().isEmail().withMessage("Email is required"),
    check("email").custom(value => {
        return User.findOne({email: value}).then(function(doc){
            if (doc)
                return Promise.reject();
            return true;
        });
    }).withMessage("Email is already registered"),

    check("username").exists().not().isEmpty().withMessage("Username is required"),
    check("username").custom(value => {
        return User.findOne({username: value}).then(function(doc){
            if (doc)
                return Promise.reject();
            return true;
        });
    }).withMessage("Username is already registered"),

    check("password").exists().not().isEmpty().withMessage("Password is required"),
    check("password").isLength({min: 8}).withMessage("Password length not enough"),
    check("password_confirm").exists().not().isEmpty().withMessage("Confirmation password is required"),
    check("password_confirm").custom((value,{req}) => {
        if (value !== req.body.password_confirm)
            throw new Error();
        return true;
    }).withMessage("Passwords do not match")
];

module.exports = validation;