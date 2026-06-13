const mongoose = require("mongoose");
const CartModel = require("../models/CartModel");
const ProfileModel = require("../models/ProfileModel");
const InvoiceModel = require("../models/InvoiceModel");
const InvoiceProductModel = require("../models/InvoiceProductModel");
const PaymentSettingModel = require("../models/PaymentSettingModel");
const ObjectID = mongoose.Types.ObjectId;
const FormData = require('form-data');
const axios = require("axios");

// ================= Invoice List =================
const InvoiceListService = async (req) => {
    try {
        let user_id = new ObjectID(req.headers.user_id);
        let invoice = await InvoiceModel.find({ userID: user_id });
        return { status: "success", data: invoice };
    } catch (error) {
        return { status: "fail", message: "Something went wrong" };
    }
};

// ================= Invoice Product List =================
const InvoiceProductListService = async (req) => {
    try {
        let user_id = new ObjectID(req.headers.user_id);
        let invoice_id = new ObjectID(req.params.invoice_id);

        let matchStage = { $match: { userID: user_id, invoiceID: invoice_id } };
        let JoinStageProduct = { $lookup: { from: "products", localField: "productID", foreignField: "_id", as: "products" } };
        let unwindStage = { $unwind: "$products" };

        let product = await InvoiceProductModel.aggregate([
            matchStage, JoinStageProduct, unwindStage
        ]);

        return { status: "success", data: product };
    } catch (error) {
        return { status: "fail", message: "Something went wrong" };
    }
};

// ================= Create Invoice =================
const CreateInvoiceService = async (req) => {
    try {
        let user_id = new ObjectID(req.headers.user_id);
        let cus_email = req.headers.email;

        let matchStage = { $match: { userID: user_id } };
        let JoinStageProduct = { $lookup: { from: "products", localField: "productID", foreignField: "_id", as: "product" } };
        let unwindStage = { $unwind: "$product" };

        // ── Check cart is not empty ──
        let CartProducts = await CartModel.aggregate([matchStage, JoinStageProduct, unwindStage]);
        if (!CartProducts || CartProducts.length === 0) {
            return { status: "fail", message: "Your cart is empty. Please add products before checkout." };
        }

        let totalAmount = 0;
        CartProducts.forEach((element) => {
            let price;
            if (element['product']['discount']) {
                price = parseFloat(element['product']['discountPrice']);
            } else {
                price = parseFloat(element['product']['price']);
            }
            totalAmount += parseFloat(element['qty']) * price;
        });

        let vat = totalAmount * 0.05;
        let payable = totalAmount + vat;

        // ── Check profile exists ──
        let Profile = await ProfileModel.aggregate([matchStage]);
        if (!Profile || Profile.length === 0) {
            return { status: "fail", message: "Profile not found. Please complete your profile before checkout." };
        }

        const profile = Profile[0];

        // ── Check required profile fields ──
        const requiredFields = ['cus_name', 'cus_add', 'cus_phone', 'cus_city', 'cus_state', 'cus_country'];
        for (let field of requiredFields) {
            if (!profile[field]) {
                return { status: "fail", message: `Profile is incomplete. Missing field: ${field}. Please update your profile.` };
            }
        }

        // ── Check shipping fields ──
        const requiredShippingFields = ['shipping_name', 'shipping_address', 'shipping_city', 'shipping_country', 'shipping_phone'];
        for (let field of requiredShippingFields) {
            if (!profile[field]) {
                return { status: "fail", message: `Shipping info is incomplete. Missing field: ${field}. Please update your profile.` };
            }
        }

        let cus_details = `Name:${profile['cus_name']} , Email:${cus_email}, Address:${profile['cus_add']} , Phone:${profile['cus_phone']}`;
        let shipping_details = `Name:${profile['shipping_name']} , City:${profile['shipping_city']}, Address:${profile['shipping_address']} , Country:${profile['shipping_country']}, Phone:${profile['shipping_phone']}`;

        let tran_id = Math.floor(10000000 + Math.random() * 90000000).toString();
        let val_id = 0;
        let delivery_status = "pending";
        let payment_status = "pending";

        let createInvoice = await InvoiceModel.create({
            userID: user_id,
            payable: payable,
            total: totalAmount,
            vat: vat,
            cus_details: cus_details,
            shipping_details: shipping_details,
            tran_id: tran_id,
            val_id: val_id,
            delivery_status: delivery_status,
            payment_status: payment_status
        });

        let invoice_id = createInvoice['_id'];

        await Promise.all(CartProducts.map(async (element) => {
            await InvoiceProductModel.create({
                userID: user_id,
                productID: element['productID'],
                invoiceID: invoice_id,
                qty: element['qty'],
                price: element['product']['discount'] ? element['product']['discountPrice'] : element['product']['price'],
                color: element['color'],
                size: element['size']
            });
        }));

        await CartModel.deleteMany({ userID: user_id });

        // ── Check payment settings exist ──
        let PaymentSettings = await PaymentSettingModel.find();
        if (!PaymentSettings || PaymentSettings.length === 0) {
            return { status: "fail", message: "Payment settings not configured. Please contact support." };
        }

        const paymentSetting = PaymentSettings[0];

        const form = new FormData();

        form.append('store_id', paymentSetting['store_id']);
        form.append('store_passwd', paymentSetting['store_passwd']);
        form.append('total_amount', payable.toString());
        form.append('currency', paymentSetting['currency']);
        form.append('tran_id', tran_id);

        form.append('success_url', `${paymentSetting['success_url']}/${tran_id}`);
        form.append('fail_url', `${paymentSetting['fail_url']}/${tran_id}`);
        form.append('cancel_url', `${paymentSetting['cancel_url']}/${tran_id}`);
        form.append('ipn_url', `${paymentSetting['ipn_url']}/${tran_id}`);

        form.append('cus_name', profile['cus_name']);
        form.append('cus_email', cus_email);
        form.append('cus_add1', profile['cus_add']);
        form.append('cus_add2', profile['cus_add']);
        form.append('cus_city', profile['cus_city']);
        form.append('cus_state', profile['cus_state']);
       form.append('cus_postcode', profile['cus_postcode'] || '1000');
        form.append('cus_country', profile['cus_country']);
        form.append('cus_phone', profile['cus_phone']);
        form.append('cus_fax', profile['cus_phone']);

        form.append('shipping_method', "YES");
        form.append('ship_name', profile['shipping_name']);
        form.append('ship_add1', profile['shipping_address']);
        form.append('ship_add2', profile['shipping_address']);
        form.append('ship_city', profile['shipping_city']);
        form.append('ship_state', profile['shipping_state'] || profile['shipping_city']);
        form.append('ship_country', profile['shipping_country']);
        form.append('ship_postcode', profile['shipping_postalcode'] || '1000');

        form.append('product_name', 'CoreVault Order');
        form.append('product_category', 'Tech Products');
        form.append('product_profile', 'general');
        form.append('product_amount', payable.toString());

        let SSLRes = await axios.post(paymentSetting['init_url'], form);

        return { status: "success", data: SSLRes.data };

    } catch (error) {
        console.error("CreateInvoiceService Error:", error.message, error.stack);
        return { status: "fail", message: error.message };
    }
};

// ================= Payment Fail =================
const PaymentFailService = async (req) => {
    try {
        let trxID = req.params.trxID;
        await InvoiceModel.updateOne({ tran_id: trxID }, { payment_status: "Fail" });
        return { status: "success", data: "Payment Failed" };
    } catch (e) {
        return { status: "fail", message: "Something went wrong" };
    }
};

// ================= Payment Cancel =================
const PaymentCancelService = async (req) => {
    try {
        let trxID = req.params.trxID;
        await InvoiceModel.updateOne({ tran_id: trxID }, { payment_status: "Cancel" });
        return { status: "success", data: "Payment Cancelled" };
    } catch (e) {
        return { status: "fail", message: "Something went wrong" };
    }
};

// ================= Payment Success =================
const PaymentSuccessInvoiceService = async (req) => {
    try {
        let trxID = req.params.trxID;
        await InvoiceModel.updateOne({ tran_id: trxID }, { payment_status: "success" });
        return { status: "success", data: "Payment Success" };
    } catch (e) {
        return { status: "fail", message: "Something went wrong" };
    }
};

// ================= Payment IPN =================
const PaymentIPNInvoiceService = async (req) => {
    try {
        let trxID = req.params.trxID;
        let status = req.body['status'];
        await InvoiceModel.updateOne({ tran_id: trxID }, { payment_status: status });
        return { status: "success" };
    } catch (e) {
        return { status: "fail", data: "Something Went Wrong" };
    }
};

module.exports = {
    PaymentCancelService,
    PaymentFailService,
    CreateInvoiceService,
    PaymentSuccessInvoiceService,
    PaymentIPNInvoiceService,
    InvoiceListService,
    InvoiceProductListService
};