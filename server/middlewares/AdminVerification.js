const { Decodetoken } = require('../utility/TokenHelper');
const AdminModel = require('../models/AdminModel');

module.exports = async (req, res, next) => {

    // Token 
    let token = req.headers['token'];
    if (!token) {
        token = req.cookies['token'];
    }

    // Token Decode
    let decoded = Decodetoken(token);

    if (decoded === null) {
        return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    // Admin 
    let admin = await AdminModel.findOne({ email: decoded['email'] });
    if (!admin) {
        return res.status(403).json({ status: "fail", message: "Forbidden: Admin access only" });
    }

    // Request 
    req.headers.email = decoded['email'];
    req.headers.user_id = decoded['user_id'];

    next();
};