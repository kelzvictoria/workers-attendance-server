const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

const User = require("../../models/User");

router.post("/", (req, res) => {
  const { username, password, role } = req.body;

  if (!username) {
    return res.status(400).json({
      success: false,
      msg: "Username is required",
    });
  }

  if (!password) {
    return res.status(400).json({
      msg: "Password is required",
    });
  }

  // if (!role) {
  //   return res.status(400).json({
  //     msg: "Role is required",
  //   });
  // }

  User.findOne({ username }).then((user) => {
    if (!user)
      return res.status(400).json({
        success: false,
        msg: "User does not exist",
      });

    //Validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid login credentials" });

      jwt.sign(
        { id: user.id },

        process.env.jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              username: user.username,
              role: user.role
            },
          });
        }
      );
    });
  });
});

//GET user details
router.get("/user", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then((user) => res.json(user));
});

module.exports = router;
