// MessageController.js
const Message = require('../models/Message');

class MessageController {
  async getMessagesByCanvasId(req, res) {
    const canvas_id = req.params.canvas_id;
    try {
      const messages = await Message.find({ canvas_id: canvas_id });
      return res.status(200).json(messages);
    } catch (e) {
      return res.status(500).json("Что-то пошло не так...");
    }
  }
}

module.exports = new MessageController();
