if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const Listing = require("./models/listings.js");
const Review = require("./models/review.js");

//  Database connection 
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl = process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(dbUrl);
}
main()
    .then(() => {
        console.log("Connected to database!");
    })
    .catch((e) => {
        console.log("The following error has occured : ", e);
    })

const path = require("path");
// const { log } = require("console");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));

const methodOverride = require("method-override");
app.use(methodOverride('_method'));

const ejsMate = require('ejs-mate');
app.engine("ejs", ejsMate);

const wrapAsync = require('./utils/wrapAsync.js'); // Wrap Async is a function
const ExpressError = require('./utils/ExpressError.js');

const { listingSchema, reviewSchema } = require('./schema.js');

const User = require('./models/user.js');

const listingRouter = require('./routes/listings.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const flash = require("connect-flash");

const session = require("express-session");
const MongoStore = require('connect-mongo');

const store = MongoStore.create({
    
    mongoUrl:dbUrl,
    touchAfter:24*3600,
    ttl:14 * 24 * 60 * 60, // = 14 days. Default
    crypto: {
        secret:process.env.SECRET,
      }
});

store.on("error", ()=>{ // if there occurs an error on mongo store 
    console.log("error on session Store,", err);
})

let sessionsOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}



app.use(session(sessionsOptions));
app.use(flash());

const passport = require("passport");
const LocalStrategy = require("passport-local");
app.use( passport.initialize() );
app.use(passport.session());
passport.use( new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // to store info of users into session!!
passport.deserializeUser(User.deserializeUser()); // to remove info of users from session!!

app.get("/demouser", async(req,res)=>{
    let fakeuser = new User({
        email:"student@gmail.com",
        username:"demouser",
    })
     let registeredUser = await User.register(fakeuser,"fakepassword"); // automatically saves it into db
     res.send(registeredUser);   
    
})


let port = 8080;
app.listen(port, () => {
    console.log("Server is listening 8080");
})

//----------------------------------------------------------------------------------------

app.get("/", (req, res) => {
    res.redirect("/listings");
})


app.get("/testlisting", async (req, res) => {
    let sampleListing = new Listing({
        title: "Grand Palace Hotel",
        description: "A luxurious hotel with breathtaking views.",
        image: {
            url: "https://unsplash.com/photos/3d-render-of-luxury-hotel-room-with-double-bed-gTA4bkiD2Xw",
            filename: "listing_image"
        },
        price: 15000,
        location: "Mumbai",
        country: "India"
    })

    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing ");
})


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingRouter);              // for listings
app.use("/listings/:id/reviews", reviewRouter);   // for reviews
app.use("/", userRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"));
})


app.use((err,req,res,next)=>{
    // next(err);
    let { statusCode = 500, message= "Some Error Occured" } = err;
    res.status(statusCode).render("error.ejs", { message });
})


