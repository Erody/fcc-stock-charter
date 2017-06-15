const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/test', apiController.test);

router.get('/getStock', apiController.getStock);

module.exports = router;
