const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require('./config/db');

// Connect Database
connectDB();
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const academicRoutes = require('./routes/academicRoutes');
const careerRoutes = require('./routes/careerRoutes');
const learningRoutes = require('./routes/learningRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/assessment', require('./routes/assessmentRoutes'));

// Root Endpoint
app.get('/', (req, res) => {
    res.send('AI Guidance Chatbot API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
