const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//@description     Get all Messages
//@route           GET /api/messages/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/messages/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Delete a Message
//@route           DELETE /api/messages/:messageId
//@access          Protected
const deleteMessage = asyncHandler(async (req, res) => {
  console.log("Received DELETE request for message ID:", req.params.messageId);
  const { messageId } = req.params;

  try {
    const message = await Message.find(messageId);

    if (!message) {
      console.log("Message not found");
      return res.status(404).json({ message: "Message not found" });
    }

    // Ensure the user is the sender
    // if (message.sender.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: "You are not authorized to delete this message" });
    // }

    await message.remove(); // Remove the message from the database

    res.status(200).json({ message: "Message deleted successfully" }); // Respond with a success message
  } catch (error) {
    res.status(500).json({ message: "Error deleting message" }); // Handle errors
  }
});

module.exports = {
  allMessages,
  sendMessage,
  deleteMessage, // Include the deleteMessage function in the exports
};
