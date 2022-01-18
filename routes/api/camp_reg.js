const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Reg = require("../../models/CampReg");

const fields = [
  {
    id: "date_created",
    name: "Date Created",
  },
  {
    id: "modified",
    name: "Date Modified",
  },
  {
    id: "modifier",
    name: "Modifier",
  },
  {
    id: "user_id",
    name: "User ID",
  },
  {
    id: "worker_id",
    name: "Worker ID",
  },
  {
    id: "worker_details",
    name: "Worker Details",
  },
];

router.get("/", (req, res) => {
  Reg.find()
    .sort({ date: -1 })
    .then((reg) => res.json(reg));
});

router.get("/:id", (req, res) => {
  Reg.findById(req.params.id).then((reg) => {
    return res.json(reg);
  });
});

router.post("/", auth, (req, res) => {
  const field_keys = fields.map((f) => f.id);
  console.log("field_keys", field_keys);

  const {
    date_created,
    modified,
    modifier,
    user_id,
    worker_id,
    worker_details,
  } = req.body;

  if (!user_id) {
    return res.status(400).json({
      msg: "User ID is required.",
    });
  }

  if (!worker_id) {
    return res.status(400).json({
      msg: "Worker ID is required.",
    });
  }

  if (!worker_details) {
    return res.status(400).json({
      msg: "Worker Details is required.",
    });
  }
  Reg.find({ worker_id }).then((reg) => {
    console.log("reg", reg);
    let today = new Date().toISOString().split("T")[0];
    let dc;
    if (reg.length > 0) {
      dc = reg[reg.length - 1].date_created.toISOString().split("T")[0];
      console.log("dc", dc, "today", today);
    }

    if (dc === today) {
      return res.status(400).json({
        msg: "Worker has already been registered!",
      });
    } else {
      const newReg = new Reg({
        date_created,
        user_id,
        worker_id,
        worker_details,
      });
      newReg.save().then((reg) => res.json(reg));
    }
  });
});

router.put("/:id", async (req, res) => {
  try {
    var reg = await Reg.findById(req.params.id).exec();
    reg.set(req.body);

    var response = await reg.save();
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:id", auth, (req, res) => {
  Reg.findById(req.params.id)
    .then((reg) => reg.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(400).json({ success: false, err }));
});

module.exports = router;
