var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
const comment = require("../models/comment");
var Comment = require("../models/comment");
var middleware = require("../middleware")

//===================COMMENTS======================
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {Campground : foundCamp});
		}
	});
});

router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
					res.redirect("/campgrounds");
				} else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
					foundCamp.comments.push(comment);
					foundCamp.save();
					req.flash("success", "Comment Added")
					res.redirect("/campgrounds/" + foundCamp._id );
				}
			});
		}
	});
	
});

router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {Campground_id : req.params.id, comment: foundComment})
		}
	})
});

router.put("/:comment_id", middleware.checkCommentOwner, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundcomment){
		if(err){
			console.log(err)
			res.redirect("back");
		} else {
			req.flash("success", "Updated Comment")
			res.redirect("/campgrounds/" + req.params.id + "/")
		}
	})
});

router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err, delComment){
		if(err){
			res.redirect("back")
		} else {
			req.flash("success", "Deleted Successfully")
			res.redirect("/campgrounds/" + req.params.id + "/")
		}
	})
});

module.exports = router;