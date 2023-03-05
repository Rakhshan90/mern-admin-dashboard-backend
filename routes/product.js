const router = require('express').Router();
const Product = require('../models/Product');
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');


//CREATE -> admin only can create products
router.post('/', verifyTokenAndAdmin, async(req, res)=>{
    const newProduct = new Product(req.body);
    
    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    }
    catch(err){
        res.status(500).json(err);
    }
})


//UPDATE -> admin only can update products 
router.put("/:id", verifyTokenAndAdmin, async(req, res)=>{
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,
            {
                //set again everyting to user's account
                $set: req.body,
            },
            //new: true to successfully update user
            {new: true}
        );
        //send this updated user 
        res.status(200).json(updatedProduct);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//  DELETE -> admin only can delete products 
router.delete("/:id", verifyTokenAndAdmin, async(req, res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product successfully has been deleted...");
    }
    catch(err){
        res.status(500).json(err);
    }
});

//GET PRODUCT 
router.get("/find/:id", async(req, res)=>{
    try{
        const product = await Product.findById(req.params.id)
        res.status(200).json(product);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//GET ALL PRODUCTS
router.get("/", async(req, res)=>{
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try{
        let products;
        if(qNew){
            //latest products fetch by limit(N) 
            products = await Product.find().sort({createdAt: -1}).limit(1);
        }
        else if(qCategory){
            //products fetch according to categories
            products = await Product.find({categories:{
                $in:[qCategory],
            },
        })
        }
        else{
            //if no query then all products from DB will fetch
            products = await Product.find();
        }
        res.status(200).json(products);
    }
    catch(err){
        res.status(500).json(err);
    }
});


module.exports = router;