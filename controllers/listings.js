const Listing = require("../models/listings");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    let allListings = await Listing.find();

    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = async (req, res)=>{
    console.log(req.user);
        res.render("listings/new.ejs");
}
 
module.exports.createlisting = async (req,res,next)=>{

   let response = await geocodingClient.forwardGeocode({
   query: req.body.location,
   limit: 1
    })
  .send()
  console.log(response.body.features[0].geometry);

  
    let { path:url, filename:filename } = req.file;
    console.log(url,"..",filename);

    let listing = req.body.list; // Sari input values ko list object se listing variable mai copy kiya..!!
    listing.owner = req.user._id;
    listing.image = { url,filename };

    const newList = new Listing(listing); // newlist database mai insert ho rahi hai...!!
    newList.geometry = response.body.features[0].geometry; // Saving geometry coordinates!
    await newList.save();    
    req.flash("success","Listing Added!");
    res.redirect("/listings");
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author"
        },
    })
    .populate("owner"); //Gets information which corresponds to id
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
    // console.log(listing.title);    
}

module.exports.renderEditForm = async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let originalUrl = listing.image.url;
  
    originalUrl = originalUrl.replace("/upload","/upload/w_250")
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{ listing, originalUrl } );
}

module.exports.updateListing = async (req,res)=>{
    let { id } = req.params;
    
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.list });
    
    if(typeof req.file != "undefined"){
        let { path:url, filename:filename } = req.file; 
        listing.image = { url,filename };
        await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}


module.exports.destroyListing = async (req,res)=>{
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing:\n",deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
    
}