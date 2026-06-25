// controllers/horarioController.js
const db = require('../config/db');

// GET /api/horarios — listar todos (opcionalmente filtrados por fecha)
const listar = (req, res) => {
    const { fecha } = req.query;

    if (fecha) {
        // Si se proporciona una fecha, cruzamos los horarios globales con la tabla de bloqueos específicos
        const sql = `
            SELECT h.id, h.hora, 
                   CASE 
                       WHEN bh.id IS NOT NULL THEN 0 
                       ELSE h.activo 
                   END AS activo
            FROM horarios h
            LEFT JOIN bloqueos_horarios bh ON bh.hora = h.hora AND bh.fecha = ?
            ORDER BY h.id`;
        db.query(sql, [fecha], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    } else {
        // Si no hay fecha, retornamos la configuración global por defecto
        db.query('SELECT * FROM horarios ORDER BY id', (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    }
};

// POST /api/horarios/toggle — activar o bloquear para una fecha específica
const toggleActivo = (req, res) => {
    const { fecha, hora } = req.body;

    if (!fecha || !hora) {
        return res.status(400).json({ error: 'Faltan datos (fecha y hora)' });
    }

    // 1. Verificar si ya existe un bloqueo para esta fecha y hora
    const sqlCheck = 'SELECT id FROM bloqueos_horarios WHERE fecha = ? AND hora = ?';
    db.query(sqlCheck, [fecha, hora], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            // Si ya está bloqueado, lo desbloqueamos (eliminamos el registro de bloqueo)
            const sqlDelete = 'DELETE FROM bloqueos_horarios WHERE fecha = ? AND hora = ?';
            db.query(sqlDelete, [fecha, hora], (err2) => {
                if (err2) return res.status(500).json({ error: err2.message });
                res.json({ ok: true, estado: 'desbloqueado' });
            });
        } else {
            // Si no está bloqueado, lo bloqueamos (insertamos un registro de bloqueo)
            const sqlInsert = 'INSERT INTO bloqueos_horarios (fecha, hora) VALUES (?, ?)';
            db.query(sqlInsert, [fecha, hora], (err2) => {
                if (err2) return res.status(500).json({ error: err2.message });
                res.json({ ok: true, estado: 'bloqueado' });
            });
        }
    });
};

module.exports = { listar, toggleActivo };
