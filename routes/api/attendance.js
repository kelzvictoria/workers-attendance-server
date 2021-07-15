const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Attendance = require("../../models/Attendance");

router.get("/", (req, res) => {
    Attendance.find()
        .sort({ date: -1 })
        .then((attendance) => res.json(attendance));
});

router.get("/:id", (req, res) => {
    Attendance.findById(req.params.id)
        .then((attendance) => {
            return res.json(attendance);
        })
})

router.post("/", auth, (req, res) => {
    const { date_created, user_id, worker_id } = req.body;

    if (!user_id || !worker_id) {
        return res.status(400).json({
            msg: "Date Created, User ID and Worker ID are required.",
        });
    }

    Attendance.findOne({ worker_id }).then((attendance) => {
        if (attendance)
            return res.status(400).json({
                msg: "Worker has already been marked present!",
            });

        const newAttendance = new Attendance({
            date_created, user_id, worker_id
        });

        newAttendance.save().then((attendance) => res.json(attendance));
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
})

router.delete("/:id", auth, (req, res) => {
    Attendance.findById(req.params.id)
        .then((attendance) =>
            attendance.remove().then(() => res.json({ success: true }))
        )
        .catch((err) => res.status(400).json({ success: false, err }));
});

module.exports = router;
