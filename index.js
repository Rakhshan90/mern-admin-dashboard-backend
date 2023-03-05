const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
const stripeRoute = require('./routes/stripe');
const cors = require('cors');

dotenv.config();
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("DBConnection Successfully!");
}).catch((err)=>{
    console.log(err);
});

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);
app.use('/api/orders', orderRoute);
app.use('/api/checkout', stripeRoute);

app.listen(process.env.PORT || port, ()=>{
    console.log(`server run successfully on  ${port} `);
})