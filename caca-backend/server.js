require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');


const app = express();


connectDB();


app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
 app.use('/api/users', userRoutes); 


app.get('/', (req, res) => {
    res.send('A API do CACA está a correr!');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
});