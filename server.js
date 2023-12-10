const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const authRoute = require("./routes/auth");
var cors = require("cors");

mongoose.connect(
  "mongodb+srv://bikaskc:zeFpBhwNBWyI7jL0@cluster0.miqfjai.mongodb.net/"
);
const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  console.log("Database connection established");
});

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({ origin: ["http://localhost:3001", "http://127.0.0.1:3001"] }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running");
});

app.use("/api", authRoute);
