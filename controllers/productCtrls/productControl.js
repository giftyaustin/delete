const { CustomError } = require('../../errorHandling/customError');
const { tryCatch } = require('../../middlewares/tryCatch');
const {Product} = require('../../models/productModel');
const { ApiFeatures } = require('../../utils/apiFeatures');



//  create a product -- admin

const createProduct=tryCatch(async(req, res,next)=>{
 
    const newProduct = await Product.create(req.body);
   
    res.status(201).json({
        success:true,
        product:newProduct
    })
})

//  get all products 

const getAllProducts = tryCatch(async (req, res,next)=>{
    const resultsPerPage = 2
    const currPage = req.query.page
   
    let apiFeature = new ApiFeatures(Product.find(), req.query).search().filter()
   
    let products = await apiFeature.query
    const totalProducts = products.length
    const skip = (Number(currPage)-1)*resultsPerPage
    products = products.slice(skip,skip+resultsPerPage)
    res.json({
        products,
        totalProducts,
        resultsPerPage,
        currPage,
       
    })
})


//  update a product -- admin

const updateProduct = tryCatch(async(req, res, next)=>{

    let productToUpdate = await Product.findById(req.params.id);
    if(!productToUpdate){
       return next(new CustomError('Product not found', 401))
    }
    productToUpdate = await Product.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true, useFindAndModify:false});
    res.status(200).json({
        success:true,
        productToUpdate
    })
})

// delete a product --admin

const deleteProduct = tryCatch(async(req,res,next)=>{
    await Product.findByIdAndDelete(req.params.id);
    
    
    res.status(200).json({
        success: true,
        message: 'deleted successully'
    })

})

//  get single product details

const getProductDetails= tryCatch(async(req, res, next)=>{
    const product = await Product.findById(req.params.id)
   
    if(!product){
        return next(new CustomError('Product not found', 401))
    }
    res.json({
        success:true,
        product
    })
})

module.exports = {getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails}