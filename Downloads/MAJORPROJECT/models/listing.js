const mongoose = require("mongoose");
const Schema = mongoose.Schema; //blueprint .keep data organized . prevent wrong data ,etc

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default:
                "https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?q=80&w=1612&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v) =>
                v === "" ? "https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?q=80&w=1612&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    : v,
        },
    },
    price: Number,
    location: String,
    country: String,
})
//listing is the name of model 
//listingSchema is the structure for the model
const Listing = mongoose.model("Listing", listingSchema);//create a new model using predefine listingSchema 

module.exports = Listing;