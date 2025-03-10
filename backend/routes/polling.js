const express = require("express");
const router = express.Router();
const Polling = require("../models/Polling");

router.get("/", async (req, res) => {
  try {
    const polls = await Polling.find({ isActive: true });
    res.json(polls); 
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { question, options } = req.body;
    const votes = new Map(options.map(option => [option, 0]))
    const newPoll = new Polling({ question, options, votes });
    await newPoll.save();
    res.status(201).json(newPoll);
  } catch (error) {
    res.status(500).json({ error: "Could not create poll" });
  }
});

router.post("/vote", async (req, res) => {
  try {
    const { pollId, option } = req.body;
    const poll = await Polling.findById(pollId);

    if (!poll || !poll.isActive) {
      return res.status(400).json({ error: "Poll not found or voting closed" });
    }

    if (!poll.options.includes(option)) {
      return res.status(400).json({ error: "Invalid option" });
    }

    // Use direct assignment
    poll.votes.set(option, (poll.votes.get(option) || 0) + 1);
    await poll.save();

    // Emit real-time update
    req.app.get("io").emit("pollData", poll);

    res.json({ message: "Vote recorded" });
  } catch (error) {
    res.status(500).json({ error: "Failed to record vote" });
  }
});

router.post("/close/:id", async (req, res) => {
  try {
    const poll = await Polling.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    poll.isActive = false;
    await poll.save();

    // Emit update
    req.app.get("io").emit("pollData", poll);

    res.json({ message: "Poll closed" });
  } catch (error) {
    res.status(500).json({ error: "Failed to close poll" });
  }
});

module.exports = router;
