var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")

router.get('/', (req, res) => {
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err);
		}
		else {
			res.render('campgrounds/index', { campgrounds: campgrounds });
		}
	})
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var newCampground = req.body.campground;
	newCampground.author = {
		id: req.user._id,
        username: req.user.username
	}
	Campground.create(newCampground, function(err, campgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
		}
	});
	//redirect back to campgrounds page
});

router.get("/new/", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

router.get("/:id/", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {Campground : foundCamp});
		}
	});
});

router.get("/:id/edit/", middleware.checkCampgroundOwner, function(req, res){
	Campground.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/edit", {Campground : foundCamp});
		}
	});
});

router.put("/:id/", middleware.checkCampgroundOwner, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.Campground, function(err, foundCamp){
		if(err){
			console.log(err);
		} else {
			req.flash("success", "Updated Campground")
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:id/", middleware.checkCampgroundOwner, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, campground){
		if(err){
			res.redirect("/campgrounds/")
		}else{
			res.redirect("/campgrounds/")
		}
	})
})

module.exports = router;