const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json());

sequelize.authenticate()
  .then(() => console.log('Database connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// sequelize.sync({ force: true })
//   .then(() => console.log('Database synchronized'))
//   .catch(err => console.error('Sync error:', err));

app.get('/test-db', async (req, res) => {
  try {
    const [results] = await sequelize.query('SELECT 1 + 1 AS result');
    res.json({ result: results[0].result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT} at ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })}`));

module.exports = app;