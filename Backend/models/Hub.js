const mongoose = require('mongoose');
const Announcement = require('./Announcement'); // Assuming you have an Announcement model

const hubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  bannerUrl: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [String],
  isPrivate: { type: Boolean, default: false },
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // NEW fields for sidebar
  announcements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Announcement' }],
  rules: [{ type: String }],
  discordLink: { type: String },
}, { timestamps: true });

module.exports = mongoose.models.Hub || mongoose.model('Hub', hubSchema);
