const express = require('express');
const app = express();
const path = require('path'); 
require('dotenv').config();
app.set('trust proxy', 1);

const router = require('./routes/api');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// DB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Database Connected"))
.catch(err => console.log(err))

// middleware
app.use(express.json({ limit: '54mb' }));
app.use(express.urlencoded({ limit: '54mb', extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

//  uploads folder static serve — routes 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
// rate limit
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });

app.use('/api/v1/Login', authLimiter);
app.use('/api/v1/Registration', authLimiter);
app.use('/api/v1', apiLimiter);

// routes
app.use('/api/v1', router);

// static frontend
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// server
app.listen(process.env.PORT || 5020, () => {
  console.log("Server running on port 5020");
});

module.exports = app;