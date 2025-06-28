const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const hubRoutes = require('./routes/hubRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes.js');
const questionRoutes = require('./routes/questions.js');
const cors = require('cors');

const app = express();

connectDB();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:8080', // ⬅️ Exactly match your frontend origin
  credentials: true,               // ⬅️ Allow cookies / tokens
}));


// 🔓 Serve uploaded images from the /uploads/posts folder
app.use('/uploads/posts', express.static(path.join(__dirname, 'uploads/posts')));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/hubs', hubRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);
app.use("/api/questions", questionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
