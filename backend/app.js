const path = require ("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

const mngConectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose
  .connect(
    // "mongodb://" + process.env.MONGODB_LOCAL,
    "mongodb+srv://" +
      process.env.MONGODB_ATL_USR +
      ":" +
      process.env.MONGODB_ATL_PW +
      process.env.MONGODB_ATL,
    mngConectionOptions
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images",express.static(path.join(__dirname, "images"))); //allows access to the image folder in the backend as a static folder in the frontend
app.use("/",express.static(path.join(__dirname, "angular"))); //allows access to the frontend folder

// section could be removed  in case of integrated frontend
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use((req,res,next) => res.sendFile(path.join(
  __dirname,
  "angular",
  "index.html"
)));

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// });

module.exports = app;