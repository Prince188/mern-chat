const express = require("express");
const {
  allMessages,
  sendMessage,
  deleteMessage,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all messages for a specific chat
router.route("/:chatId").get(protect, allMessages);

// Send a new message
router.route("/").post(protect, sendMessage);

// Delete a specific message by its ID
router.route("/:messageId").delete(deleteMessage);

module.exports = router;
