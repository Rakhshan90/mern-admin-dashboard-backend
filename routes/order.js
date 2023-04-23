const router = require('express').Router();
const Order = require('../models/Order');
const {verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken} = require('./verifyToken');


//CREATE
router.post('/', verifyToken, async(req, res)=>{
    const newOrder = new Order(req.body);
    
    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    }
    catch(err){
        res.status(500).json(err);
    }
})


//UPDATE -> admin can only update order
router.put("/:id", verifyTokenAndAdmin, async(req, res)=>{
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,
            {
                //set again everyting 
                $set: req.body,
            },
            //new: true to successfully update user's cart
            {new: true}
        );
        //send this updated cart 
        res.status(200).json(updatedOrder);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//  DELETE -> admin can only delete order
router.delete("/:id", verifyTokenAndAdmin, async(req, res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order successfully has been deleted...");
    }
    catch(err){
        res.status(500).json(err);
    }
});

//GET USER ORDER -> user can access it's all orders
router.get("/find/:userId",verifyTokenAndAuthorization ,async(req, res)=>{
    try{
        const orders = await Order.find({userId: req.params.userId});
        res.status(200).json(orders);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//GET ALL -> only admin can access all user's orders
router.get("/",verifyTokenAndAdmin ,async(req, res)=>{

    try{
       const orders = await Order.find();
        res.status(200).json(orders);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//MONTHLY INCOME
router.get('/income', verifyTokenAndAdmin, async(req, res)=>{
    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1));

    try {
        const income = await Order.aggregate([
          {
            $match: {
              createdAt: { $gte: previousMonth },
              ...(productId && {
                products: { $elemMatch: { productId } },
              }),
            },
          },
          {
            $project: {
              month: { $month: "$createdAt" },
              sales: "$amount",
            },
          },
          {
            $group: {
              _id: "$month",
              total: { $sum: "$sales" },
            },
          },
        ]);
        res.status(200).json(income);
    }
    catch(err){
        res.status(500).json(err);
    }
}) ;


module.exports = router;