const express = require("express");
const app = express();
const mongoose = require("mongoose");
let port = 8080;
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");//help to create template
const wrapAsyc = require("./utils/wrapAsyc");
const ExpressError = require("./utils/ExpressError");
const {listingSchema} = require("./schema")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL)
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Hi i am root")
})

const validateListing = (req,res,next) => {
     let {error} = listingSchema.validate(req.body)
    if(error){
        throw new ExpressError(404 , error);
    }else{
        next();
    }

}
//Index route
app.get("/listings", wrapAsyc(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id", wrapAsyc(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}))

//create route
app.post("/listings",validateListing, wrapAsyc(async (req, res ,next) => {
    const data = req.body.listing;

    // Defensive check
    if (!data.price) {
        data.price = 1000; // Default fallback
    }

    const newListing = new Listing(data);
    
    await newListing.save();
    res.redirect("/listings");
    })
);


//edit route
app.get("/listings/:id/edit", wrapAsyc(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}))

//update route
app.put("/listings/:id",validateListing, wrapAsyc(async (req, res) => {
    let { id } = req.params;

    // Set default price only if price is missing or null
    if (req.body.listing.price == null) {
        req.body.listing.price = 1000;
    }

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));


//DELETE ROUTE
app.delete("/listings/:id", wrapAsyc(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}))

// app.get("/testListing" , async (req,res) => {
//     let sampleListing = new Listing ({
//         title:"My New Villa",
//         description:"By the beach",
//         price: 1200,
//         location:"calangute, Goa",
//         country:"India", 
//     });
//     await sampleListing.save();
//     console.log("sample was save");
//     res.send("successful testing")
// })

//if above routes not accept the route 
app.use((req,res,next) => {
    next(new ExpressError (404 , "Page not Found!"))
})

//err middleware
app.use((err,req,res,next) => {
    let {statusCode=500 , message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {err})
    //res.status(statusCode).send(message);
})

app.listen(port, () => {
    console.log(`server is listening ${port}`)
})
