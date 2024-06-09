const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
// Routes
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');


require('dotenv').config();

const app = express();


const corsOptions = {
  origin: "*",
  methods : "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());



app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);




const PORT = process.env.PORT || 5000;

mongoose
  .connect(`mongodb+srv://${process.env.USER}:${process.env.PW}@cluster0.frdodhc.mongodb.net/ECOM?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => {
    app.listen(PORT);
    console.log(`server running on ${PORT}`);
  })
  .catch((err) => console.log(err));

 

