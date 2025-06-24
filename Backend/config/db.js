// config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Replace this with your actual MongoDB connection string
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/hobbyhub';

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false, // deprecated in latest mongoose
      // useCreateIndex: true, // deprecated in latest mongoose
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
