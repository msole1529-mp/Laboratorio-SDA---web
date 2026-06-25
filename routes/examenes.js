const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM examenes LIMIT 25';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener exámenes' });
        res.json(results);
    });
});

module.exports = router;