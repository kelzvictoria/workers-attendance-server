const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Directorate = require("../../models/Directorate");

router.get("/", (req, res) => {
    Directorate.find()
        .sort({ date: -1 })
        .then((directorate) => res.json(directorate));
});

router.get("/:id", (req, res) => {
    Directorate.findById(req.params.id)
        .then((directorate) => {
            return res.json(directorate);
        })
})

router.post("/", auth, (req, res) => {
    const { name, director, user_id } = req.body;

    if (!name || !director || !user_id) {
        return res.status(400).json({
            msg: "Directorate Name and Director are required.",
        });
    }

    Directorate.findOne({ director }).then((directorate) => {
        if (directorate)
            return res.status(400).json({
                msg: "Directorate has already been added!",
            });

        const newDirectorate = new Directorate({
            name, director, user_id
        });

        newDirectorate.save().then((directorate) => res.json(directorate));
    });
});

router.put("/:id", async (req, res) => {
    try {
        var directorate = await Directorate.findById(req.params.id).exec();
        directorate.set(req.body);

        var response = await directorate.save();
        res.send(response);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.delete("/:id", auth, (req, res) => {
    Directorate.findById(req.params.id)
        .then((directorate) =>
            directorate.remove().then(() => res.json({ success: true }))
        )
        .catch((err) => res.status(400).json({ success: false, err }));
});

module.exports = router;
