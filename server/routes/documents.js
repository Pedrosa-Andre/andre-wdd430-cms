var express = require("express");
const sequenceGenerator = require("./sequenceGenerator");

const Document = require("../models/document");

var router = express.Router();

sequenceGenerator.initialize();

// GET request to retrieve documents
router.get("/", async (req, res, next) => {
  try {
    const documents = await Document.find();
    res.status(200).json({
      resMessage: "Documents retrieved successfully",
      documents: documents,
    });
  } catch (error) {
    res.status(500).json({
      resMessage: "Error when getting documents.",
      error: error,
    });
  }
});

// POST request to create a new document
router.post("/", async (req, res, next) => {
  try {
    const maxDocumentId = await sequenceGenerator.nextId("documents");

    const document = new Document({
      id: maxDocumentId,
      name: req.body.name,
      description: req.body.description,
      url: req.body.url,
    });

    const createdDocument = await document.save();
    res.status(201).json({
      resMessage: "Document added successfully",
      document: document,
    });
  } catch (error) {
    res.status(500).json({
      resMessage: "An error occurred",
      error: error,
    });
  }
});

// PUT request to update an existing document
router.put("/:id", async (req, res, next) => {
  try {
    const document = await Document.findOne({ id: req.params.id });
    if (!document) {
      return res.status(404).json({
        resMessage: "Document not found.",
      });
    }

    document.name = req.body.name;
    document.description = req.body.description;
    document.url = req.body.url;

    const updatedDocument = await Document.updateOne(
      { id: req.params.id },
      document
    );
    res.status(200).json({
      resMessage: "Document updated successfully",
      document: document,
    });
  } catch (error) {
    res.status(500).json({
      resMessage: "An error occurred",
      error: error,
    });
  }
});

// DELETE request to remove an existing document
router.delete("/:id", async (req, res, next) => {
  try {
    const document = await Document.findOne({ id: req.params.id });
    if (!document) {
      return res.status(404).json({
        resMessage: "Document not found.",
      });
    }

    await Document.deleteOne({ id: req.params.id });
    res.status(200).json({
      resMessage: "Document deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      resMessage: "An error occurred",
      error: error,
    });
  }
});


module.exports = router;
