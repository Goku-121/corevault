const AdminModel = require('../models/AdminModel');
const bcrypt = require('bcrypt');
const { Encodetoken } = require('../utility/TokenHelper');
const EmailSend = require('../utility/EmailHelper');
const ProductDetailsModel = require('../models/ProductDetailsModel');

// Admin Register Service
exports.AdminRegisterService = async (reqBody) => {
    try {
        let { name, email, password, phone } = reqBody;
        if (!email || !password) {
            return { status: "fail", message: "Email and password are required" };
        }
        let existing = await AdminModel.findOne({ email: email.toLowerCase() });
        if (existing) {
            return { status: "fail", message: "Admin already exists with this email" };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await AdminModel.create({
            name: name || "Admin",
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
            otp: null,
            otpExpiry: null,
            isVerified: true
        });
        return { status: "success", message: "Admin registered successfully. Please login." };
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.AdminVerifyOTPService = async (reqBody) => {
    return { status: "success", message: "Verified" };
};

// Admin Login Service
exports.AdminLoginService = async (reqBody) => {
    try {
        let { email, password } = reqBody;
        if (!email || !password) {
            return { status: "fail", message: "Email and password are required" };
        }
        let admin = await AdminModel.findOne({ email: email.toLowerCase() });
        if (!admin) {
            return { status: "fail", message: "Admin not found" };
        }
        if (!admin.isVerified) {
            return { status: "fail", message: "Account not verified. Please complete OTP verification." };
        }
        let isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return { status: "fail", message: "Incorrect password" };
        }
        let token = Encodetoken(admin.email, admin._id);
        return {
            status: "success",
            message: "Login successful",
            token: token,
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email
            }
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Admin Profile Service
exports.AdminProfileService = async (email) => {
    try {
        let admin = await AdminModel.findOne({ email }).select('-password');
        if (!admin) {
            return { status: "fail", message: "Admin not found" };
        }
        return { status: "success", data: admin };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Admin Dashboard Stats Service
exports.AdminDashboardStatsService = async () => {
    try {
        const UserModel = require('../models/UserModel');
        const ProductModel = require('../models/ProductModel');
        const InvoiceModel = require('../models/InvoiceModel');
        let [totalUsers, totalProducts, totalOrders, revenueData] = await Promise.all([
            UserModel.countDocuments(),
            ProductModel.countDocuments(),
            InvoiceModel.countDocuments(),
            InvoiceModel.aggregate([
                { $group: { _id: null, totalRevenue: { $sum: "$payable_amount" } } }
            ])
        ]);
        let totalRevenue = revenueData[0]?.totalRevenue || 0;
        return {
            status: "success",
            data: { totalUsers, totalProducts, totalOrders, totalRevenue }
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Admin User List Service
exports.AdminUserListService = async () => {
    try {
        const UserModel = require('../models/UserModel');
        let users = await UserModel.find().select('-password').sort({ createdAt: -1 });
        return { status: "success", data: users };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Admin User Details Service
exports.AdminUserDetailsService = async (id) => {
    try {
        const UserModel = require('../models/UserModel');
        let user = await UserModel.findById(id).select('-password');
        if (!user) return { status: "fail", message: "User not found" };
        return { status: "success", data: user };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Admin Delete User Service
exports.AdminDeleteUserService = async (id) => {
    try {
        const UserModel = require('../models/UserModel');
        let deleted = await UserModel.findByIdAndDelete(id);
        if (!deleted) return { status: "fail", message: "User not found" };
        return { status: "success", message: "User deleted successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Admin Order List Service
exports.AdminOrderListService = async () => {
    try {
        const InvoiceModel = require('../models/InvoiceModel');
        let orders = await InvoiceModel.find().sort({ createdAt: -1 });
        return { status: "success", data: orders };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Admin Order Details Service
exports.AdminOrderDetailsService = async (id) => {
    try {
        const InvoiceModel = require('../models/InvoiceModel');
        let order = await InvoiceModel.findById(id);
        if (!order) return { status: "fail", message: "Order not found" };
        return { status: "success", data: order };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Admin Order Status Update Service
exports.AdminOrderStatusService = async (id, reqBody) => {
    try {
        const InvoiceModel = require('../models/InvoiceModel');
        let { status } = reqBody;
        let updated = await InvoiceModel.findByIdAndUpdate(
            id,
            { delivery_status: status },
            { new: true }
        );
        if (!updated) return { status: "fail", message: "Order not found" };
        return { status: "success", message: "Order status updated", data: updated };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Admin Product List Service
exports.AdminProductListService = async () => {
    try {
        const ProductModel = require('../models/ProductModel');
        let products = await ProductModel.find().sort({ createdAt: -1 });
        return { status: "success", data: products };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Admin Product Details Service
exports.AdminProductDetailsService = async (id) => {
    try {
        const ProductModel = require('../models/ProductModel');
        let product = await ProductModel.findById(id);
        if (!product) return { status: "fail", message: "Product not found" };
        return { status: "success", data: product };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Admin Create Product Service
exports.AdminCreateProductService = async (reqBody) => {
    try {
        const ProductModel = require('../models/ProductModel');
        let result = await ProductModel.create(reqBody);
        return { status: "success", data: result };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Admin Create Product Details Service
exports.AdminCreateProductDetailsService = async (data) => {
    try {
        let result = await ProductDetailsModel.create(data);
        return { status: "success", data: result };
    } catch (error) {
        return { status: "fail", message: error.message };
    }
};

// Admin Update Product Service
exports.AdminUpdateProductService = async (id, reqBody) => {
    try {
        const ProductModel = require('../models/ProductModel');
        let updated = await ProductModel.findByIdAndUpdate(id, reqBody, { new: true });
        if (!updated) return { status: "fail", message: "Product not found" };
        return { status: "success", message: "Product updated successfully", data: updated };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Admin Delete Product Service
exports.AdminDeleteProductService = async (id) => {
    try {
        const ProductModel = require('../models/ProductModel');
        let deleted = await ProductModel.findByIdAndDelete(id);
        if (!deleted) return { status: "fail", message: "Product not found" };
        return { status: "success", message: "Product deleted successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
};