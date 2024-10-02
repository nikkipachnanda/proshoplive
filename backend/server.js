import path from 'path';
import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import connnectDb from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js" ;
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import uploadRoutes from './routes/uploadRoutes.js';

connnectDb(); 

const port= process.env.PORT || 5000;    

const app = express();

//Cooke parser middle ware
app.use(cookieParser());

//Body parser middlware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/api/config/paypal', (req, res) => {
    res.send({
        clientId:process.env.PAYPAL_CLIENT_ID
    })
})

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use('/uploads', express.static('/var/data/uploads'));
    app.use(express.static(path.join(__dirname, '/frontend/build')));
  
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
  } else {
    const __dirname = path.resolve();
    app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
    app.get('/', (req, res) => {
      res.send('API is running....');
    });
  }


app.listen(port, ()=> console.log(`Server running on port ${port}`))