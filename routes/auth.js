const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

router.post('/login', controller.login);
router.get('/logout', controller.logout);

module.exports = router;