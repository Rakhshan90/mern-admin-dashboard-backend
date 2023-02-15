const mongoose = require('mongoose');
//creating our Order schema
const OrderSchema = new mongoose.Schema(
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
        amout:{type:Number, required:true},
        addres:{type:Object, required:true},
        status:{type: String, default:"pending"},
    },
    //timestamps used to get current from server and it updates current time as well.
    {timestamps: true}
);

module.exports = mongoose.model('Order', OrderSchema);