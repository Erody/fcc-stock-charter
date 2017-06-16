const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/test', apiController.test);
router.get('/getStock', apiController.getStock);
router.get('/getInitialStock', catchErrors(apiController.getInitialStock));

module.exports = router;
