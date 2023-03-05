const router = require('express').Router();
const User = require('../models/User');
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');


//UPDATE -> user can change it's password
router.put("/:id", verifyTokenAndAuthorization, async(req, res)=>{
    if(req.body.password){
        //new password is also encrypted
        req.body.password=CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            {
                //set again everyting to user's account
                $set: req.body,
            },
            //new: true to successfully update user
            {new: true}
        );
        //send this updated user 
        res.status(200).json(updatedUser);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//  DELETE -> User can delete it's account
router.delete("/:id", verifyTokenAndAuthorization, async(req, res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User successfully has been deleted...");
    }
    catch(err){
        res.status(500).json(err);
    }
});

//GET -> Admin can only get any user 
router.get("/find/:id", verifyTokenAndAdmin, async(req, res)=>{
    try{
        const user = await User.findById(req.params.id)
        const{password, ...others} = user._doc;
        res.status(200).json(others);
    }
    catch(err){
        res.status(500).json(err);
    }
});
//GET ALL USERS OR A/C TO QUERY 
router.get("/", verifyTokenAndAdmin, async(req, res)=>{
    const query = req.query.new;
    try{
        const users = query? await User.find().sort({_id: -1}).limit(1) : await User.find()
        res.status(200).json(users);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//GET USER STATS
router.get('/stats', verifyTokenAndAdmin, async(req, res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));

    try{
        const data = await User.aggregate([
            {$match : {createdAt: {$gte: lastYear} } },
            {
                $project:{
                    month: {$month: "$createdAt"},
                },
            },
            {
                $group: {
                    //total users in particular month
                    _id: "$month",
                    total : {$sum: 1},
                },
            },
        ]);
        res.status(200).json(data);
    }
    catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;