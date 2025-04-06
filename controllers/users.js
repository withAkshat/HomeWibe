const User = require("../models/user");

module.exports.signUp = async (req,res)=>{
    try{
    let { username , email, password } = req.body;
    let newUser = new User({ email, username })
    let registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    // Automatic login!
    req.login(registeredUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to WanderLust");
        res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginform = (req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.login = (req,res)=>{
    req.flash("success","Welcome to Wanderlust");

    let redirect = res.locals.redirectUrl || "/listings";
    res.redirect(redirect);
};

module.exports.logout =  (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logout Successful");
        res.redirect("/listings");
    })
}
