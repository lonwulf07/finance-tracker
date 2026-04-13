const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const transactions = require('./routes/transactions');
const auth = require('./routes/auth');

const app = express();

app.use(cors()); 
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/transactions', transactions);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});