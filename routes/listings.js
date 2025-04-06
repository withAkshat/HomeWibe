const express = require('express');
const router = express.Router();

const { listingSchema, reviewSchema } = require('../schema.js');
const Listing = require("../models/listings.js");
const wrapAsync = require('../utils/wrapAsync.js'); // Wrap Async is a function
const ExpressError = require('../utils/ExpressError.js');

const { isLoggedIn, isOwner, validateListing } = require('../middlewares.js');
const listingsControllers = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }) //initilizer!


// Index Route
router.get("/", listingsControllers.index);

// New Route
router.get("/new", isLoggedIn, listingsControllers.renderNewForm);

// Show Route
router.get("/:id",listingsControllers.showListing);

// Create Route..
router.post("/", isLoggedIn, upload.single('list[image]'), validateListing,wrapAsync(listingsControllers.createlisting));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, listingsControllers.renderEditForm);

// Update Route
router.put("/:id", isLoggedIn, isOwner, upload.single('list[image]'), validateListing,wrapAsync(listingsControllers.updateListing));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, listingsControllers.destroyListing);

module.exports = router;