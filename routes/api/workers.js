const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Worker = require("../../models/Worker");

router.get("/", (req, res) => {
  Worker.find()
    .sort({ date: -1 })
    .then((workers) => res.json(workers));
});

router.get("/:id", (req, res) => {
  Worker.findById(req.params.id)
    .then((worker) => {
      return res.json(worker);
    })
})

router.post("/", auth, (req, res) => {
  const { first_name, last_name, middle_name, phone_num, ministry_arm, email_address, role, user_id } = req.body;

  if (!first_name || !last_name || !user_id) {
    return res.status(400).json({
      msg: "First Name is required.",
    });
  }

  if (!last_name) {
    return res.status(400).json({
      msg: "Last Name is required.",
    });
  }

  if (!user_id) {
    return res.status(400).json({
      msg: "User ID is required.",
    });
  }

  if (!role) {
    return res.status(400).json({
      msg: "Role is required",
    });
  }

  // if (!) {
  //     return res.status(400).json({
  //       msg: " is required",
  //     });
  //   }

  if (phone_num || email_address) {
    Worker.findOne({ phone_num, email_address }).then((worker) => {

      if (worker) {
        return res.status(400).json({
          msg: "Worker already exists",
        });
      }

      const newWorker = new Worker({
        first_name,
        last_name,
        middle_name,
        phone_num,
        ministry_arm,
        role,
        email_address,
        user_id
      });

      newWorker.save().then((worker) => res.json(worker));
    });
  } else {

    const newWorker = new Worker({
      first_name,
      last_name,
      middle_name,
      phone_num,
      ministry_arm,
      role,
      email_address,
      user_id
    });

    newWorker.save().then((worker) => res.json(worker));
  }

});

router.put("/:id", async (req, res) => {
  try {
    var worker = await Worker.findById(req.params.id).exec();
    worker.set(req.body);

    var response = await worker.save();
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
})

router.delete("/:id", auth, (req, res) => {
  Worker.findById(req.params.id)
    .then((worker) =>
      worker.remove().then(() => res.json({ success: true }))
    )
    .catch((err) => res.status(400).json({ success: false, err }));
});

module.exports = router;
