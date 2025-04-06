const Joi = require('joi');

// Listing Schema!
module.exports.listingSchema = Joi.object({  
    list : Joi.object({                   // Defining an object schema!
        title: Joi.string().required(),
        description: Joi.string().required(),

        image:Joi.string().allow("",null),
        
        price: Joi.number().min(0),
        location: Joi.string().required(),
        country: Joi.string().required()
    }).required()
})

// Review Schema!
module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
})