const { 
    ProductBrandListService, 
    CategoryListService, 
    SliderListService, 
    ListByBrandService, 
    ListByCategoryService, 
    ListBySimilarService, 
    ListByKeywordService, 
    ListByRemarkService, 
    DetailsService, 
    ReviewListService 
} = require('../services/ProductServices');

//  CONTROLLER FUNCTIONS

const ProductBrandList = async (req, res) => {
    let result = await ProductBrandListService();
    return res.status(200).json(result);

}

const ProductCategoryList = async (req, res) => {
    let result = await CategoryListService();
    return res.status(200).json(result);
};

const ProductSliderList = async (req, res) => {
    let result = await SliderListService();
    return res.status(200).json(result);
};

const ProductListByBrand = async (req, res) => {
   let result = await ListByBrandService(req);
   return res.status(200).json(result);
}

const ProductListByCategory = async (req, res) => {
      let result = await ListByCategoryService(req);
     return res.status(200).json(result)
    
};

const ProductListBySimilar = async (req, res) => {
   
};

const ProductByKeyword = async (req, res) => {
    
};

const ProductListByRemark = async (req, res) => {
    let result = await ListByRemarkService(req);
    return res.status(200).json(result);
    
};

const ProductDetails = async (req, res) => {
    
};

const ProductReviewList = async (req, res) => {
    
};

const CreateProductReview = async (req, res) => {
    
    return res.status(200).json({ status: "success", message: "Review created" });
};


module.exports = {
    ProductBrandList,
    ProductCategoryList,
    ProductSliderList,
    ProductListByBrand,
    ProductListByCategory,
    ProductListBySimilar,
    ProductByKeyword,
    ProductListByRemark,
    ProductDetails,
    ProductReviewList,
    CreateProductReview
};