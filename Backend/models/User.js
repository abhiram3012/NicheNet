const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  avatar: { type: String, default: '' }, // URL or image path
  bio: { type: String, default: '' },
  karma: { type: Number, default: 0 },
  joinedHubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hub' }],
  createdHubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hub' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
