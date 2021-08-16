const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Attendance = require("../../models/Attendance");

const fields = [
    {
        id: "date_created",
        name: "Date Created"
    },
    {
        id: "modified",
        name: "Date Modified"
    },
    {
        id: "modifier",
        name: "Modifier"
    },
    {
        id: "user_id",
        name: "User ID"
    },
    {
        id: "worker_id",
        name: "Worker ID"
    },
    {
        id: "worker_details",
        name: "Worker Details"
    },
]

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

    const field_keys = fields.map(f => f.id);
    console.log("field_keys", field_keys);

    const { date_created,
        modified,
        modifier,
        user_id,
        worker_id,
        worker_details
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
    /*for (let i = 0; i < field_keys.length; i++) {
        let in_consid = field_keys[i];
        let is_empty = !req.body[field_keys[i]] ? true : false;
        console.log("in_consid",
            in_consid,
            "field_keys[i]",
            field_keys[i],
            "is_empty",
            is_empty
        );
        switch (req.body[field_keys[i]]) {
            case is_empty:
                return res.status(400).json({
                    msg: `${fields[i].name} is required.`,
                });
            default:
                return res.status(400).json({
                    msg: "Date Created, User ID, Worker ID and Worker Details are required.",
                });
        }
    } */

    // if (!user_id || !worker_id || !worker_details) {
    //     return res.status(400).json({
    //         msg: "Date Created, User ID, Worker ID and Worker Details are required.",
    //     });
    // }

    Attendance.findOne({ worker_id }).then((attendance) => {
        let today = new Date().toISOString().split("T")[0];
        console.log("attendance.date_created", attendance.date_created);
        if (attendance && attendance.date_created.split("T")[0] === today) {
            return res.status(400).json({
                msg: "Worker has already been marked present!",
            });
        }



        const newAttendance = new Attendance({
            date_created, user_id, worker_id, worker_details
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
