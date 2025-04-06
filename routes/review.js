const express = require('express');
const router = express.Router({mergeParams:true});

const Review = require("../models/review.js");
const wrapAsync = require('../utils/wrapAsync.js'); // Wrap Async is a function
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const Listing = require("../models/listings.js");

const { isLoggedIn, validateReview, isAuthor } = require('../middlewares.js');

const reviewController = require("../controllers/reviews.js");

// Review Model!
router.post("/",isLoggedIn, validateReview, wrapAsync( reviewController.createReview ))

// Delete Review 
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync( reviewController.deleteReview ))

module.exports = router;