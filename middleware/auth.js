const jwt = require("jsonwebtoken");
//const router = require("../routes/api/users");
const User = require("../models/User");

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  //check for token
  if (!token)
    return res.status(401).json({
      msg: "No token, authorization denied",
    });

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.jwtSecret);

    //Add user from payload
    req.user = decoded;
    req.headers["Content-type"] = "application/json";
    req.headers["Access-Control-Allow-Origin"] = "*";

    next();
  } catch (e) {
    res.status(400).json({ msg: "token is not valid" });
  }
}

module.exports = auth;
