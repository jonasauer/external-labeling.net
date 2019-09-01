const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const user_schema = mongoose.Schema({
    _id:        String,
    firstname:  {type: String,      required: true,     unique: false},
    lastname:   {type: String,      required: true,     unique: false},
    username:   {type: String,      required: true,     unique: true },
    email:      {type: String,      required: true,     unique: true },
    password:   {type: String,      required: true,     unique: false},
}, {collection: global.config.user_collection});

user_schema.pre('save', function(next) {
    this._id = this._id.toString();
    next();
});



const User = module.exports = mongoose.model('User', user_schema);



//insert default user if there is no user saved
User.find().then(function(doc){
    if(!doc || doc.length <= 0){
        console.error("Create user");
        let salt = bcrypt.genSaltSync(16);
        let hash = bcrypt.hashSync("admin", salt);

        const data = new User({
            _id: mongoose.Types.ObjectId(),
            firstname: "Admin",
            lastname: "Admin",
            email: "admin@admin.com",
            username: "admin",
            password: hash
        });
        data.save();
    }
});