const { check, validationResult } = require('express-validator');
const User = require('../../model/user');

const validation = [

    //check if id of account to update equals id of logged in user
    check("_id").exists().not().isEmpty().withMessage("An error occurred while updating your account"),
    check("_id").custom((value, {req}) => {
        return value === req.user._id;
    }).withMessage("Cannot update an account from someone else"),

    //check if first and last name exists
    check("firstname").exists().not().isEmpty().withMessage("First name is required"),
    check("lastname").exists().not().isEmpty().withMessage("Last name is required"),

    //check if email exists and if found in database, check if ids match
    check("email").exists().isEmail().withMessage("Email is required and must be valid"),
    check("email").custom((value, {req}) => {
        return User.findOne({email: value}).then(function(doc){
            if (doc && doc._id !== req.body._id)
                return Promise.reject();
            return true;
        });
    }).withMessage("Email is already registered"),

    //check if username exists and if found in database, check if ids match
    check("username").exists().not().isEmpty().withMessage("Username is required"),
    check("username").custom((value, {req}) => {
        return User.findOne({username: value}).then(function(doc){
            if (doc && doc._id !== req.body._id)
                return Promise.reject();
            return true;
        });
    }).withMessage("Username is already registered")
];

module.exports = validation;