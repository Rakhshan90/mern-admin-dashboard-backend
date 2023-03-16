const mongoose = require('mongoose');
//creating our Product schema
const ProductSchema = new mongoose.Schema(
    {
        title:{type:String, required: true, unique: true},
        desc:{type:String, required: true},
        img:{type: Image, required: true},
        categories:{type: Array},
        size:{type: Array},
        color:{type: Array},
        price:{type: Number, required: true},
        inStock:{type: Boolean, default: true},
    },
    //timestamps used to get current from server and it updates current time as well.
    {timestamps: true}
);

module.exports = mongoose.model('Product', ProductSchema);