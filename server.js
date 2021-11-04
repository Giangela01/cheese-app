// Dependencies
require("dotenv").config();
const { PORT = 3000, MONGODB_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

//Database connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
//Events
mongoose.connection
  .on("open", () => console.log("Your are connected to Cheese World"))
  .on("close", () => console.log("Your are disconnected from Cheese World"))
  .on("error", (error) => console.log(error));
//Models

const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String,
  });

const Cheese = mongoose.model("Cheese", CheeseSchema);

//Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//Routes
app.get("/", (req, res) => {
  res.send("A Cheesy World");
});
//Cheese Index
app.get("/cheese", async (req, res) => {
    try {
      res.json(await Cheese.find({}));
    } catch (error) {
      res.status(400).json(error);
    }
  });
//Cheese Create
app.post("/cheese", async (req, res) => {
    try {
      res.json(await Cheese.create(req.body));
    } catch (error) {
      res.status(400).json(error);
    }
  });
//Cheese Update
app.put("/cheese/:id", async (req, res) => {
    try {
      res.json(
        await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      res.status(400).json(error);
    }
  });
//Cheese Delete
app.delete("/cheese/:id", async (req, res) => {
    try {
      res.json(await Cheese.findByIdAndRemove(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
  });

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));