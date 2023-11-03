const express = require("express");
const Topic = require("../models/Topic");
const router = express.Router();
const auth = require("../validations/verifyToken");
const mongoose = require('mongoose')


router.get("/", auth, async (req, res) => {
  try {
    console.log(req.user);
    const topics = await Topic.find();
    return res.send(topics);
  } catch (err) {
    return res.status(400).send({ message: err });
  }
});

router.post("/", auth, async (req, res) => {
    console.log(req.body)
  const topicData = new Topic({
    title: req.body.title,
    userId: req.user._id,
  });
  console.log(topicData);
  try {
    const topicToSave = await topicData.save();
    res.send(topicToSave);
  } catch (err) {
    return res.send({ message: err });
  }
});

module.exports = router;