const Sequence = require("../models/sequence");

class SequenceGenerator {
  constructor() {
    this.maxDocumentId = null;
    this.maxMessageId = null;
    this.maxContactId = null;
    this.sequenceId = null;
  }

  async initialize() {
    try {
      const sequence = await Sequence.findOne();
      if (!sequence) {
        throw new Error("Sequence document not found");
      }

      this.sequenceId = sequence._id;
      this.maxDocumentId = sequence.maxDocumentId;
      this.maxMessageId = sequence.maxMessageId;
      this.maxContactId = sequence.maxContactId;
    } catch (err) {
      console.error("Error initializing sequence generator:", err);
      throw err;
    }
  }

  async nextId(collectionType) {
    let updateObject = {};
    let nextId;

    switch (collectionType) {
      case "documents":
        this.maxDocumentId++;
        updateObject = { maxDocumentId: this.maxDocumentId };
        nextId = this.maxDocumentId;
        break;
      case "messages":
        this.maxMessageId++;
        updateObject = { maxMessageId: this.maxMessageId };
        nextId = this.maxMessageId;
        break;
      case "contacts":
        this.maxContactId++;
        updateObject = { maxContactId: this.maxContactId };
        nextId = this.maxContactId;
        break;
      default:
        return -1;
    }

    try {
      await Sequence.updateOne(
        { _id: this.sequenceId },
        { $set: updateObject }
      );
    } catch (err) {
      console.error("Error updating sequence:", err);
      return null;
    }

    return nextId;
  }
}

module.exports = new SequenceGenerator();
