require('dotenv').config();
const express = require('express');
const cors = require('cors');
const balanceController = require('./controllers/balanceController');
const watchListController = require('./controllers/watchListController');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Single balance check
app.get('/balance', balanceController.getBalance);

// Watch list management
app.post('/watch', watchListController.addToWatchList);
app.delete('/watch', watchListController.removeFromWatchList);
app.get('/watch', watchListController.getWatchList);
app.post('/watch/check-now', watchListController.checkBalancesNow);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 