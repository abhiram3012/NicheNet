const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ✅ Add this
  isAnonymous: { type: Boolean, default: false },
  karma: { type: Number, default: 0 },
  badges: [{ type: String }],
  joinedHubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hub' }],
  profileRank: { type: String, default: 'Newbie' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
