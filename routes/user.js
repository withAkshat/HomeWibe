const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js'); // Wrap Async is a function
const ExpressError = require('../utils/ExpressError.js');
const passport = require('passport');
const { redirectUrl } = require('../middlewares.js');
const userController = require("../controllers/users.js");

router.get("/signup", (req,res)=>{
    res.render("./users/users.ejs");
})

router.post("/signup", wrapAsync(userController.signUp));

// Login authentication!
router.get("/login", userController.renderLoginform);

router.post("/login",
    redirectUrl,
 passport.authenticate( "local",{ failureRedirect:"/login", failureFlash:true }),
userController.login);

// Logout user!
router.get("/logout",userController.logout);

module.exports = router;