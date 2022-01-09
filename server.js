const express = require("express");
const mongoose = require("mongoose");

const path = require("path");

var cors = require("cors");

require("dotenv").config();

const auth = require("./routes/api/auth");
const users = require("./routes/api/users");
const attendance = require("./routes/api/attendance");
const directorate = require("./routes/api/directorate");
const ministry_arm = require("./routes/api/ministry_arm");
const workers = require("./routes/api/workers");

const app = express();
app.use(cors());
app.use(express.json());
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

app.use(function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // next();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


const db = process.env.mongoURI;

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/attendance", attendance);
app.use("/api/directorates", directorate);
app.use("/api/ministry_arms", ministry_arm);
app.use("/api/workers", workers);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
