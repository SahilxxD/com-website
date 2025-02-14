const express = require('express');
const connectDB = require('./config/db'); 
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();
const PORT = 8000;

app.use(express.json())

app.use('/api/auth', require('./routes/authRoutes'));

app.get('/',(req, res) => {
    res.send('Welcome to ecom');
});

app.listen(PORT, () => console.log('Server Listening'))