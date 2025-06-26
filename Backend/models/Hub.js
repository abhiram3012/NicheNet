const mongoose = require('mongoose');

const hubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  bannerUrl: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  tags: [String],

  // Privacy-related
  isPrivate: { type: Boolean, default: false },
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Hub', hubSchema);
