
module.exports = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("danger", "Please login");
        res.redirect('/user/login');
    }
};