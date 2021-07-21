const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");

const jwt = require("jsonwebtoken");

const User = require("../../models/User");

router.get("/", (req, res) => {
  User.find()
    .sort({
      date: -1
    }).then((users) => res.json(users))
});

router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      return res.json(user);
    })
})

router.post("/", (req, res) => {
  const { username, password, role } = req.body;
  //console.log(username, email, password, role);
  if (!username || !password || !role) {
    return res.status(400).json({
      msg: "Please enter all fields",
    });
  }

  User.findOne({ username }).then((user) => {
    if (user)
      return res.status(400).json({
        msg: "User already exists",
      });
    // console.log("user", user);
    User.findOne({ username }).then((acc) => {
      if (acc)
        return res.status(400).json({
          msg: "This Username already exists",
        });
      // console.log("acc", acc);
    })


    const newUser = new User({
      username,
      password,
      role
    });

    //Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },

            process.env.jwtSecret,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                id: user.id,
                username: user.username,
                role: user.role
              });
            });
        });
      });
    });
  });
});

router.put("/:id", async (req, res) => {

  try {
    var user = await User.findById(req.params.id).exec();
    user.set(req.body);

    var response = await user.save();
    res.send(response);
  } catch (error) {
    res.status(500).send(error)
  }

});


router.delete("/:id", auth, (req, res) => {
  User.findById(req.params.id)
    .then((user) =>
      user.remove().then(() => res.json({
        success: true
      }))
    ).catch((err) => res.status(400).json({
      success: false,
      err
    }))
})

module.exports = router;
