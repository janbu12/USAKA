require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

require('./config/firebase');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./app/routes/auth');
const apiRoutes = require('./app/routes/api');

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
            status: err.status || 500
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});