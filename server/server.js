const express = require('express');
const app = express();

const router = require('./routes/api');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');

// DB
mongoose.connect('mongodb://127.0.0.1:27017/ecommarce')
.then(() => console.log("Database Connected"))
.catch(err => console.log(err))

// middleware
app.use(express.json({ limit: '54mb' }));
app.use(express.urlencoded({ limit: '54mb', extended: true }));

app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// routes
app.use('/api/v1', router);

// static frontend
app.use(express.static(path.join(__dirname, '../client/dist'))); 

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});
// server
app.listen(5000, () => {
  console.log(" Server running on port 5000");
});


module.exports = app;