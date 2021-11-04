////////////////////////////////////////////////
// Dependencies
////////////////////////////////////////////////
require("dotenv").config()
const {PORT, MONGODB_URL} = process.env
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")

const app = express()

// TEST COMMENT TO SEE IF REPO WORKS

////////////////////////////////////////////////
// DB
////////////////////////////////////////////////
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})

mongoose.connection
    .on("open", () => {console.log("Connected to Mongo")})
    .on("close", () => {console.log("Disconnected from Mongo")})
    .on("error", (err) => {console.log(err)})

////////////////////////////////////////////////
// Model/Schema
////////////////////////////////////////////////
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String,
})

const Cheese = mongoose.model("Cheese", CheeseSchema)

////////////////////////////////////////////////
// Middleware
////////////////////////////////////////////////
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

////////////////////////////////////////////////
// Seed
////////////////////////////////////////////////
const cheeses = [
    {
        name: "Gruyere",
        countryOfOrigin: "Switzerland",
        image: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Gruyere_alpage_th_wa.jpg"
    },
    {
        name: "Mizithra",
        countryOfOrigin: "Greece",
        image: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Homemade_Mizithra.jpg"
    },
    {
        name: "Cotswold",
        countryOfOrigin: "United Kingdom",
        image: "https://cdn.shopify.com/s/files/1/0176/4774/products/Long_Clawson_Cotswold__40844.1557362793.jpg?v=1587210359"
    }
]

////////////////////////////////////////////////
// Routes
////////////////////////////////////////////////

// Seed
app.get("/cheese/seed", async (req,res) => {
    await Cheese.deleteMany({})
    const startCheeses = await Cheese.create(cheeses)
    res.json(startCheeses)
})

// Index
app.get("/cheese", async (req,res) => {
    try {
        res.json(await Cheese.find({}))
    } catch (err) {
        res.status(400).json(err)
    }
})

// Delete
app.delete("/cheese/:id", async (req,res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id))
    } catch (err) {
        res.status(400).json(err)
    }
})

// Update
app.put("/cheese/:id", async (req,res) => {
    try {
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (err) {
        res.status(400).json(err)
    }
})

// Create
app.post("/cheese", async (req,res) => {
    try {
        res.json(await Cheese.create(req.body))
    } catch (err) {
        res.status(400).json(err)
    }
})

////////////////////////////////////////////////
// Listener
////////////////////////////////////////////////
app.listen(PORT, () => {console.log(`On ${PORT}`)})