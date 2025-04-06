const Listing = require("./models/listings");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require('./schema.js');
const ExpressError = require('./utils/ExpressError.js');

module.exports.isLoggedIn =(req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){ // Is user loggedIn?
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","User must be loggedIn!");
        return res.redirect("/login");
    }
    next();
}

// this is done because on login of user the passport resets the session 
// thats why we are using local variable ..!!

module.exports.redirectUrl = (req,res,next)=>{
    res.locals.redirectUrl = req.session.redirectUrl;
    next();
}


// whether the who is acessing the listing (for edit delete or update) is owner or not!!
module.exports.isOwner = async (req,res,next)=>{
    let { id } = req.params;
    let listingInfo = await Listing.findById(id);
    if(!listingInfo.owner.equals(res.locals.currUser._id) ){
        req.flash("error","No permission! Changes denied!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    console.log(error);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);  
    }
    else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};


// To delete the review by author if the review!
module.exports.isAuthor = async (req,res,next)=>{
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id) ){
        req.flash("error","No permission! Delete Request Denied!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}