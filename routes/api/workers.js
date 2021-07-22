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

  if (!first_name || !last_name
    //|| !middle_name || !phone_num 
    || !user_id) {
    return res.status(400).json({
      msg: "First Name, Last Name are required.",
    });
  }

  Worker.findOne({ phone_num, email_address }).then((worker) => {

    if (worker && phone_num || worker && email_address)
      return res.status(400).json({
        msg: "Worker already exists",
      });

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
