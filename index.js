const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');

dotenv.config();
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("DBConnection Successfully!");
}).catch((err)=>{
    console.log(err);
});

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

app.listen(process.env.PORT || port, ()=>{
    console.log(`server run successfully on  ${port} `);
})