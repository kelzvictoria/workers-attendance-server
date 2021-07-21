const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const MinistryArm = require("../../models/MinistryArm");

router.get("/", (req, res) => {
    MinistryArm.find()
        .sort({ date: -1 })
        .then((ministry_arm) => res.json(ministry_arm));
});

router.get("/:id", (req, res) => {
    MinistryArm.findById(req.params.id)
        .then((ministry_arm) => {
            return res.json(ministry_arm);
        })
})

router.post("/", auth, (req, res) => {
    const { date_created,
        user_id,
        name,
        directorate_id,
        ministry_head,
        ministry_head_details,
        directorate_details } = req.body;

    if (!name || !directorate_id || !ministry_head || !user_id) {
        return res.status(400).json({
            msg: "Name, Ministry Head and Directorate are required.",
        });
    }

    MinistryArm.findOne({ name }).then((ministry_arm) => {
        if (ministry_arm)
            return res.status(400).json({
                msg: "Ministry Arm has already been added!",
            });

        const newMinistryArm = new MinistryArm({
            user_id, name, directorate_id, ministry_head, ministry_head_details, directorate_details
        });

        newMinistryArm.save().then((ministry_arm) => res.json(ministry_arm));
    });
});

router.put("/:id", async (req, res) => {
    try {
        var ministry_arm = await MinistryArm.findById(req.params.id).exec();
        ministry_arm.set(req.body);

        var response = await ministry_arm.save();
        res.send(response);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.delete("/:id", auth, (req, res) => {
    MinistryArm.findById(req.params.id)
        .then((ministry_arm) =>
            ministry_arm.remove().then(() => res.json({ success: true }))
        )
        .catch((err) => res.status(400).json({ success: false, err }));
});

module.exports = router;
