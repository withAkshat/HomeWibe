const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
        default:1,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:"User",
    }
})

const Review = mongoose.model("Review" , reviewSchema);
module.exports = Review;

// const  initData = async ()=>{
//     let allReviews = await Review.find({});
//     allReviews = allReviews.map( (obj)=>({...obj,author:'67e6e1f5a1ff4a797bc6095d'}))
//     await Review.deleteMany();
//     await Review.insertMany(allReviews);
//     console.log("Data was Initilized!");
    
// }


