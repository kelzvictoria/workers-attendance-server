const express = require("express");
const mongoose = require("mongoose");

const path = require("path");

var cors = require("cors");

require("dotenv").config();

const users = require("./routes/api/users");
const auth = require("./routes/api/auth");
const attendance = require("./routes/api/attendance");
const directorate = require("./routes/api/directorate");
const ministry_arm = require("./routes/api/ministry_arm");
const workers = require("./routes/api/workers");

const app = express();
app.use(cors());
app.use(express.json());

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
