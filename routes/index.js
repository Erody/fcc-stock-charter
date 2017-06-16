const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chartController');
const {catchErrors} = require('../handlers/errorHandlers');

router.get('/', chartController.getStockChart);

module.exports = router;
