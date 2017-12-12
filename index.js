// Initial Dependencies
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express(); // App instance
const router = require("./router");
const mongoose = require("mongoose");
const cors = require("cors");

// DB Setup
mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://localhost:auth/auth",
  { useMongoClient: true },
  function(err) {
    if (err) {
      console.log("error: ", err);
    } else {
      console.log("connected to the database");
    }
  }
);

// App Setup
app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json({ type: "*/*" }));
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on: ", port);
