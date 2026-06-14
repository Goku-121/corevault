const {
    CreateInvoiceService,
    InvoiceListService,
    InvoiceProductListService,
    PaymentSuccessInvoiceService,
    PaymentCancelService,
    PaymentFailService,
    PaymentIPNInvoiceService
} = require("../services/InvoiceServices");

exports.CreateInvoiceService = async (req, res) => {
    let result = await CreateInvoiceService(req);
    return res.status(200).json(result);
};

exports.InvoiceListService = async (req, res) => {
    let result = await InvoiceListService(req);
    return res.status(200).json(result);
};

exports.InvoiceProductListService = async (req, res) => {
    let result = await InvoiceProductListService(req);
    return res.status(200).json(result);
};

exports.PaymentSuccessInvoiceService = async (req, res) => {
    await PaymentSuccessInvoiceService(req);
    return res.redirect(`https://corevault22.onrender.com/orders`);
};

exports.PaymentCancelService = async (req, res) => {
    await PaymentCancelService(req);
    return res.redirect(`https://corevault22.onrender.com/cart`);
};

exports.PaymentFailService = async (req, res) => {
    await PaymentFailService(req);
    return res.redirect(`https://corevault22.onrender.com/cart`);
};

exports.PaymentIPNInvoiceService = async (req, res) => {
    let result = await PaymentIPNInvoiceService(req);
    return res.status(200).json(result);
};