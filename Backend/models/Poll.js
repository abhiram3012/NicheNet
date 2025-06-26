const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: String,
  votes: { type: Number, default: 0 },
});

const pollSchema = new mongoose.Schema({
  title: String,
  hub: { type: mongoose.Schema.Types.ObjectId, ref: 'Hub' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  options: [optionSchema],
  voters: [
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        optionText: String // or optionId if you prefer using IDs
    }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);
