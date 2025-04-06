const mongoose = require('mongoose');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main(){
   await mongoose.connect(MONGO_URL);
}
main()
.then(()=>{
    console.log("Connected to database!");
})
.catch((e)=>{
    console.log(e);
})

const initData = require('./data.js');
const Listing = require('../models/listings.js');

async function initDB(){
    await Listing.deleteMany({});
    initData.data = initData.data.map( (obj)=> ({ ...obj, owner:'67e2e9d4e26f9988bf54959b' }));
    await Listing.insertMany(initData.data);
    console.log("Data was Initilized!");
}

initDB();

