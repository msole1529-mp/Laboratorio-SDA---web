// routes/horarios.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/horarioController');

router.get('/', controller.listar);
router.post('/toggle', controller.toggleActivo);

module.exports = router;
