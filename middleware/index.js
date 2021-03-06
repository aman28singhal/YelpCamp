var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to Login first!")
    res.redirect("/login")
};

middlewareObj.checkCampgroundOwner = function (req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCamp){
			if(err){
				req.flash("error", "Campground not Found")
				res.redirect("/campgrounds")
			} else {	
				if(foundCamp.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission for that")
					res.redirect("back");
				}
			}
		})
		
    } else {
		req.flash("error", "You need to Login First!")
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwner = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Comment not Found")
				res.redirect("back")
			} else {	
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission for that")
					res.redirect("back");
				}
			}
		})
		
    } else {
		req.flash("error", "You need to Login First!")
		res.redirect("back");
	}
}

module.exports = middlewareObj;