const BrandModel = require('../models/BrandModel');
const CategoryModel = require('../models/CategoryModel');
const ProductModel = require('../models/ProductModel');
const ProductSliderModel = require('../models/ProductSliderModel');
const ProductReviewModel = require('../models/ReviewModel');
const ProductDetailsModel = require('../models/ProductDetailsModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

//  SERVICES
const ProductBrandListService = async () => { 
    try {
        let data = await BrandModel.find();
        return {status: "success", data: data};
    } catch (error) {
        return { status: "error", data: error.message }.toString(); 
    }
}

const CategoryListService = async () => { 
    try {
        let data = await CategoryModel.find();
        return {status: "success", data: data};
    } catch (error) {
        return { status: "error", data: error.message }.toString(); 
    }
}

const SliderListService = async () => { 
    try {
        let data = await ProductSliderModel.find();
        return {status:"success", data:data}
    } catch (error) {
        return { status: "error", data: error.message }.toString(); 
    }
}
const ListByBrandService = async (req) => {
    try {
        let BrandID = new ObjectId(req.params.BrandID);
        
        

        let MatchStage = { $match: { brandId: BrandID } };
        let JoinWithBrandStage = { $lookup: { from: "brands", localField: "brandId", foreignField: "_id", as: "brand" } };
        let JoinWithCategoryStage = { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "category" } };
        let UnwindBrandStage = { $unwind: "$brand" };
        let UnwindCategoryStage = { $unwind: "$category" };
        let ProjectionStage = { $project: {'brand.id': 0, 'category.id': 0, 'categoryId': 0 ,'brandId': 0, } }
       
       
        let data = await ProductModel.aggregate([
            MatchStage,
            JoinWithBrandStage,
            JoinWithCategoryStage,
            UnwindBrandStage, UnwindCategoryStage,
            ProjectionStage
        ]);

        
        
        return { status: "success", data: data };
    } catch (error) {
       
        return { status: "error", data: error.message };
    }
}
const ListByCategoryService = async (req) => {
    
    try {
        let CategoryID = new ObjectId(req.params.CategoryID);
        
        

        let MatchStage = { $match: { categoryId: CategoryID } };
        let JoinWithBrandStage = { $lookup: { from: "brands", localField: "brandId", foreignField: "_id", as: "brand" } };
        let JoinWithCategoryStage = { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "category" } };
        let UnwindBrandStage = { $unwind: "$brand" };
        let UnwindCategoryStage = { $unwind: "$category" };
        let ProjectionStage = { $project: {'brand.id': 0, 'category.id': 0, 'categoryId': 0 ,'brandId': 0, } }
       
       
        let data = await ProductModel.aggregate([
            MatchStage,
            JoinWithBrandStage,
            JoinWithCategoryStage,
            UnwindBrandStage, UnwindCategoryStage,
            ProjectionStage
        ]);

        
        
        return { status: "success", data: data };
    } catch (error) {
       
        return { status: "error", data: error.message };
    }
}


const ListBySimilarService = async () => {

}
 
const ListByKeywordService = async () => {

}
 
const ListByRemarkService = async (req) => {
try {
        let Remark = req.params.Remark;
        
        

        let MatchStage = { $match: { remark: Remark } };
        let JoinWithBrandStage = { $lookup: { from: "brands", localField: "brandId", foreignField: "_id", as: "brand" } };
        let JoinWithCategoryStage = { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "category" } };
        let UnwindBrandStage = { $unwind: "$brand" };
        let UnwindCategoryStage = { $unwind: "$category" };
        let ProjectionStage = { $project: {'brand.id': 0, 'category.id': 0, 'categoryId': 0 ,'brandId': 0, } }
       
       
        let data = await ProductModel.aggregate([
            MatchStage,
            JoinWithBrandStage,
            JoinWithCategoryStage,
            UnwindBrandStage, UnwindCategoryStage,
            ProjectionStage
        ]);

        
        
        return { status: "success", data: data };
    } catch (error) {
       
        return { status: "error", data: error.message };
    }
}


 
const DetailsService = async () => {

}
 
const ReviewListService = async () => {

 }

module.exports = {
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
};