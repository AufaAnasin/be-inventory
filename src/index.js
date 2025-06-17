const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json());

app.use('/api', productRoutes);
app.use('/api', authRoutes);

sequelize.authenticate()
  .then(() => console.log('Database connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT} at ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })}`));

module.exports = app;