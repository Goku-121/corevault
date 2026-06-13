const express = require('express');
const router = express.Router();

const ProductController =require( '../controller/ProductController')
const UserController = require('../controller/UserController')
const AuthVerification = require('../middlewares/AuthVerification')
const WishListController =require('../controller/WishListController')
const CartListController = require('../controller/CartlListController') 
const InvoiceController = require('../controller/InvoiceController')

const FeaturesController = require('../controller/FeaturesController')

const AdminController = require('../controller/AdminController');
const AdminVerification = require('../middlewares/AdminVerification');

const upload = require('../middlewares/upload');


//Product
router.get('/ProductBrandList', ProductController.ProductBrandList);
router.get('/ProductCategoryList', ProductController.ProductCategoryList);
router.get('/ProductSliderList', ProductController.ProductSliderList);



// Brand Category
router.get('/ProductListByBrand/:BrandID', ProductController.ProductListByBrand);
router.get('/ProductListByCategory/:CategoryID', ProductController.ProductListByCategory);
router.get('/ProductListBySimilar/:CategoryID', ProductController.ProductListBySimilar);
router.get('/ProductByKeyword/:Keyword', ProductController.ProductByKeyword);
router.get('/ProductListByRemark/:Remark', ProductController.ProductListByRemark);
router.get('/ProductDetails/:ProductID', ProductController.ProductDetails);
router.get('/ProductReviewList/:ProductID', ProductController.ProductReviewList);

router.post('/ProductListByFilter', ProductController.ProductListByFilter);


// Users
router.get('/UserOTP/:email', UserController.UserOTP);
router.get('/VerifyLogin/:email/:otp', UserController.VerifyLogin);
router.get('/UserLogout',AuthVerification, UserController.UserLogout);
router.post('/CreateProfile',AuthVerification, UserController.CreateProfile);
router.post('/UpdateProfile', AuthVerification, UserController.UpdateProfile);
router.get('/ReadProfile', AuthVerification, UserController.ReadProfile);

// Register
router.post('/RegisterOTP', UserController.RegisterOTP);
router.post('/VerifyRegisterOTP', UserController.VerifyRegisterOTP);
router.post('/LoginWithPassword', UserController.LoginWithPassword);

// WishList

router.get('/WishListServices', AuthVerification, WishListController.WishListServices);
router.post('/CreateWishList', AuthVerification, WishListController.CreateWishListService);
router.post('/RemoveWishList', AuthVerification, WishListController.RemoveWishListService);
// router.get('/SaveWishListServices',AuthVerification,WishListController.SaveWishListServices)

// Cart
router.get('/CartListService', AuthVerification, CartListController.CartListServices);
router.post('/SaveCartListService', AuthVerification, CartListController.SaveCartListService);
router.post('/UpdateCartListService/:cartID', AuthVerification, CartListController.UpdateCartListService);
router.delete('/RemoveCartListService/:cartID', AuthVerification, CartListController.RemoveCartListService); 



//Invoice & Payment
router.get('/CreateInvoiceService', AuthVerification, InvoiceController.CreateInvoiceService);
router.get('/InvoiceListService', AuthVerification, InvoiceController.InvoiceListService);
router.get('/InvoiceProductListService/:invoice_id', AuthVerification, InvoiceController.InvoiceProductListService );


// PAYMENT CALLBACKS
router.post('/PaymentSuccessInvoiceService/:trxID', InvoiceController.PaymentSuccessInvoiceService);
router.post('/PaymentCancelService/:trxID', InvoiceController.PaymentCancelService);
router.post('/PaymentFailService/:trxID', InvoiceController.PaymentFailService);
router.post('/PaymentIPNInvoiceService/:trxID', InvoiceController.PaymentIPNInvoiceService);


//Features

router.get('/FeaturesList', FeaturesController.FeaturesList);

//Create Review
router.post('/CreateReview', AuthVerification, ProductController.CreateReview);

//Legal Terms and Other Privecy Policy
router.get( '/LegalDetails/:type', FeaturesController.LegalDetails)




 
// Admin Auth
router.post('/AdminLogin', AdminController.AdminLogin);
router.post('/AdminRegister', AdminController.AdminRegister);
router.post('/AdminVerifyOTP', AdminController.AdminVerifyOTP);

// Admin Protected Routes
router.get('/AdminProfile', AdminVerification, AdminController.AdminProfile);
router.get('/AdminDashboardStats', AdminVerification, AdminController.AdminDashboardStats)


// Admin User Management
router.get('/AdminUserList', AdminVerification, AdminController.AdminUserList);
router.get('/AdminUserDetails/:id', AdminVerification, AdminController.AdminUserDetails);
router.delete('/AdminDeleteUser/:id', AdminVerification, AdminController.AdminDeleteUser);

// Admin Order Management
router.get('/AdminOrderList', AdminVerification, AdminController.AdminOrderList);
router.get('/AdminOrderDetails/:id', AdminVerification, AdminController.AdminOrderDetails);
router.put('/AdminOrderStatus/:id', AdminVerification, AdminController.AdminOrderStatus);



// Admin Product Management
router.get('/AdminProductList', AdminVerification, AdminController.AdminProductList);
router.get('/AdminProductDetails/:id', AdminVerification, AdminController.AdminProductDetails);
router.post('/AdminCreateProduct', AdminVerification, AdminController.AdminCreateProduct);
router.put('/AdminUpdateProduct/:id', AdminVerification, AdminController.AdminUpdateProduct);
router.delete('/AdminDeleteProduct/:id', AdminVerification, AdminController.AdminDeleteProduct);


// Image Upload
router.post('/UploadImage', AdminVerification, upload.single('image'), AdminController.UploadImage);
// Product Details
router.post('/AdminCreateProductDetails', AdminVerification, AdminController.AdminCreateProductDetails);
module.exports = router;
