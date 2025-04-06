const Review = require("../models/review");
const Listing = require("../models/listings");

module.exports.createReview = async (req,res)=>{
    let { review } = req.body;
     
    let listing = await Listing.findById(req.params.id);
    const newReview = new Review(review);
    newReview.author = res.locals.currUser._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Added!");
    res.redirect(`/listings/${listing._id}`);

}

module.exports.deleteReview = async (req,res)=>{
    let { id,reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId} });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}