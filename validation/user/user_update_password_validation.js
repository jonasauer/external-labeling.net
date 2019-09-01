const { check, validationResult } = require('express-validator');
const User = require('../../model/user');

const validation = [

    //check if id of account to update equals id of logged in user
    check("_id").exists().not().isEmpty().withMessage("An error occurred while updating your account"),
    check("_id").custom((value, {req}) => {
        return value === req.user._id;
    }).withMessage("Cannot update an account from someone else"),

    //check passwords
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