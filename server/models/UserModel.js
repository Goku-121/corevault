const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true, lowercase: true },
    otp: { type: String, required: true }
},{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('users', DataSchema);