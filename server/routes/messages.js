var express = require("express");
const sequenceGenerator = require("./sequenceGenerator");

const Message = require("../models/message");

var router = express.Router();

sequenceGenerator.initialize();

// GET request to retrieve messages
router.get("/", async (req, res, next) => {
  try {
    const messages = await Message.find();
    res.status(200).json({
      resMessage: "Messages retrieved successfully",
      messages: messages,
    });
  } catch (error) {
    res.status(500).json({
      resMessage: "Error when getting messages.",
      error: error,
    });
  }
});

// POST request to create a new message
router.post("/", async (req, res, next) => {
  try {
    const maxMessageId = await sequenceGenerator.nextId("messages");

    const message = new Message({
      id: maxMessageId,
      subject: req.body.subject,
      msgText: req.body.msgText,
      sender: req.body.sender,
    });

    const createdMessage = await message.save();
    res.status(201).json({
      resMessage: "Message added successfully",
      message: message,
    });
  } catch (error) {
    res.status(500).json({
      resMessage: "An error occurred",
      error: error,
    });
  }
});

module.exports = router;
