const mongoose = require('mongoose');
//creating our Cart schema
const CartSchema = new mongoose.Schema(
    {
        userId:{type:String, required: true},
        products:[
            {
                productId:{
                    type:String,
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
    },
    //timestamps used to get current from server and it updates current time as well.
    {timestamps: true}
);

module.exports = mongoose.model('Cart', CartSchema);