const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Attendance = require("../../models/Attendance");

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
  Attendance.find()
    .sort({ date: -1 })
    .then((attendance) => res.json(attendance));
});

router.get("/:id", (req, res) => {
  Attendance.findById(req.params.id).then((attendance) => {
    return res.json(attendance);
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
  Attendance.find({ worker_id }).then((attendance) => {
    console.log("attendance", attendance);
    let today = new Date().toISOString().split("T")[0];
    let dc;
    if (attendance.length > 0) {
      dc = attendance[attendance.length - 1].date_created
        .toISOString()
        .split("T")[0];
      console.log("dc", dc, "today", today);
    }

    if (dc === today) {
      return res.status(400).json({
        msg: "Worker has already been marked present!",
      });
    } else {
      const newAttendance = new Attendance({
        date_created,
        user_id,
        worker_id,
        worker_details,
      });
      newAttendance.save().then((attendance) => res.json(attendance));
    }
  });
});

router.put("/:id", async (req, res) => {
  try {
    var attendance = await Attendance.findById(req.params.id).exec();
    attendance.set(req.body);

    var response = await attendance.save();
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:id", auth, (req, res) => {
  Attendance.findById(req.params.id)
    .then((attendance) =>
      attendance.remove().then(() => res.json({ success: true }))
    )
    .catch((err) => res.status(400).json({ success: false, err }));
});

module.exports = router;
