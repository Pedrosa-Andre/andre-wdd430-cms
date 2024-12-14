const sequenceGenerator = require("./sequenceGenerator");
var express = require("express");

const Contact = require("../models/contact");

var router = express.Router();

sequenceGenerator.initialize();

// GET request to retrieve contacts
router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contact.find().populate("group");
    res.status(200).json({
      message: "Contacts retrieved successfully",
      contacts: contacts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error when getting contacts.",
      error: error,
    });
  }
});

// POST request to create a new contact
router.post("/", async (req, res, next) => {
  try {
    const maxContactId = await sequenceGenerator.nextId("contacts");

    // Create a new contact
    const contact = new Contact({
      id: maxContactId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imageUrl: req.body.imageUrl,
      group: req.body.group,
    });

    // Save the new contact to the database
    await contact.save();

    // Fetch the saved contact and populate the group field
    const populatedContact = await Contact.findOne({ id: maxContactId }).populate('group');

    // Respond with the populated contact
    res.status(201).json({
      message: "Contact added successfully",
      contact: populatedContact,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error,
    });
  }
});

// PUT request to update an existing contact
router.put("/:id", async (req, res, next) => {
  try {
    // Find the contact by ID
    const contact = await Contact.findOne({ id: req.params.id });
    if (!contact) {
      return res.status(404).json({
        message: "Contact not found.",
      });
    }

    // Update contact fields
    contact.name = req.body.name;
    contact.email = req.body.email;
    contact.phone = req.body.phone;
    contact.imageUrl = req.body.imageUrl;
    contact.group = req.body.group;

    // Save the updated contact
    await contact.save();

    // Retrieve the updated contact with populated group
    const updatedContact = await Contact.findOne({ id: req.params.id }).populate('group');

    // Respond with the updated contact, including the populated group field
    res.status(200).json({
      message: "Contact updated successfully",
      contact: updatedContact,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
});

// DELETE request to remove an existing contact
router.delete("/:id", async (req, res, next) => {
  try {
    const contact = await Contact.findOne({ id: req.params.id });
    if (!contact) {
      return res.status(404).json({
        message: "Contact not found.",
      });
    }

    await Contact.deleteOne({ id: req.params.id });
    res.status(200).json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error,
    });
  }
});

module.exports = router;
