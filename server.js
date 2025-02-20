const express = require('express');
const connectDB = require('./config/db'); 
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
require('./config/passport');

dotenv.config();
connectDB();

const app = express();
const PORT = 8000;

app.use(express.json())

app.use(session({secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/user', require('./routes/userRoutes'));

app.use('/api/product', require('./routes/productRoutes'));

app.use('/api/cart', require('./routes/cartRoutes'));

app.use('/api/orders', require('./routes/orderRoutes'))

app.use('/api/email', require('./routes/emailRoutes'))

app.get('/',(req, res) => {
    res.send('Welcome to ecom');
});

app.listen(PORT, () => console.log('Server Listening'))