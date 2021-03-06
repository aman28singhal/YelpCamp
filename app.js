var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
    passportLocalMongoose = require("passport-local-mongoose"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment")
	User = require("./models/user")
	SeedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes//index");

app.use(express.urlencoded( {extended: true} ));
app.use(methodOverride("_method"));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"))

//mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser : true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.connect(process.env.DATABASEURL ,{useNewUrlParser : true, useUnifiedTopology: true, useFindAndModify: false});
//SeedDB();
app.use(flash());
app.use(require("express-session")({
	secret: "Don't matter",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


//===================LISTENING======================
app.listen(process.env.PORT || 3000,process.env.IP, () => {
	console.log('YelpCamp server is running...');
});