// models/Announcement.js
const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  hub: { type: mongoose.Schema.Types.ObjectId, ref: 'Hub', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
