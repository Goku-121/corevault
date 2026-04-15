const express = require('express');
const router = express.Router();
const ProductController =require( '../controller/ProductController')


//Product

router.get('/ProductBrandList', ProductController.ProductBrandList);
router.get('/ProductCategoryList', ProductController.ProductCategoryList);
router.get('/ProductSliderList', ProductController.ProductSliderList);

router.get('/ProductListByBrand/:BrandID', ProductController.ProductListByBrand);
router.get('/ProductListByCategory/:CategoryID', ProductController.ProductListByCategory);
router.get('/ProductListBySimilar/:Keyword', ProductController.ProductListBySimilar);
router.get('/ProductByKeyword/:Keyword', ProductController.ProductByKeyword);
router.get('/ProductListByRemark/:Remark', ProductController.ProductListByRemark);
router.get('/ProductDetails/:ProductID', ProductController.ProductDetails);
router.get('/ProductReviewList/:ProductID', ProductController.ProductReviewList);
// Brand Category

module.exports = router ;
