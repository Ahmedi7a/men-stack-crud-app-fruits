require('dotenv').config();
require('./config/database')
const express = require("express");
const methodOverride = require("method-override"); // new
const app = express();
const morgan = require('morgan');

//models
const Fruit = require("./models/fruit");


//middleware
app.use(morgan('dev'));
// need to put it to read the body in form
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

//===========================================
//puplic routes
app.get("/", async (req, res) => {
    res.render("index.ejs");
});

app.get("/fruits", async (req, res) => {
    const allFruits = await Fruit.find({});
    console.log(allFruits); // log the fruits!
    res.render('fruits/index.ejs',{fruits:allFruits})
});

//create fruit
app.get("/fruits/new", (req, res) => {
    res.render('fruits/new.ejs')
})

//delete
app.delete("/fruits/:fruitId", async (req, res) => {
    const deletedF = await Fruit.findByIdAndDelete(req.params.fruitId);
    res.redirect('/fruits')
});

// POST /fruits
app.post("/fruits", async (req, res) => {
    try {
        if (req.body.isReadyToEat === "on") {
            req.body.isReadyToEat = true;
        } else {
            req.body.isReadyToEat = false;
        }
    const newFruit = await Fruit.create(req.body);
    } catch (err) {
        console.log('EERRROR');
    }
    console.log(req.body);
    res.redirect("/fruits");
});

//show
app.get("/fruits/:fruitId", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render("fruits/show.ejs", { fruits: foundFruit });
});

//edit
app.get("/fruits/:fruitId/edit", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render("fruits/edit.ejs", {
      fruits: foundFruit,
    });
});

app.put("/fruits/:fruitId", async (req, res) => {
    try {
        if (req.body.isReadyToEat === "on") {
            req.body.isReadyToEat = true;
        } else {
            req.body.isReadyToEat = false;
        }
    const editedFruit = await Fruit.findByIdAndUpdate(req.params.fruitId,req.body);
    } catch (err) {
        console.log('EERRROR');
    }
    res.redirect(`/fruits/${req.params.fruitId}`);
});


//=============================================
app.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port 3000");
});