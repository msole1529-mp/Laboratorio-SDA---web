const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Horarios ocupados por fecha
router.get('/ocupados', (req, res) => {
    const { fecha } = req.query;
    db.query(
        'SELECT hora FROM reservas WHERE fecha = ?',
        [fecha],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener horarios' });
            res.json(results.map(r => r.hora));
        }
    );
});

// Buscar reserva por RUT
router.get('/buscar', (req, res) => {
    const { rut } = req.query;
    db.query(
        `SELECT r.id, r.nombre_paciente, r.rut, r.fecha, r.hora,
         GROUP_CONCAT(e.nombre SEPARATOR ', ') AS examenes
         FROM reservas r
         LEFT JOIN detalle_reserva dr ON dr.reserva_id = r.id
         LEFT JOIN examenes e ON e.id = dr.examen_id
         WHERE r.rut = ?
         GROUP BY r.id
         ORDER BY r.fecha DESC`,
        [rut],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al buscar' });
            res.json(results);
        }
    );
});

// Crear reserva
router.post('/', (req, res) => {
    const { nombre_paciente, rut, fecha, hora, examenes } = req.body;

    if (!nombre_paciente || !rut || !fecha || !hora || !examenes || examenes.length === 0) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    db.query(
        'INSERT INTO reservas (nombre_paciente, rut, fecha, hora) VALUES (?, ?, ?, ?)',
        [nombre_paciente, rut, fecha, hora],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al crear reserva' });
            const reserva_id = result.insertId;
            const detalles = examenes.map(examen_id => [reserva_id, examen_id]);
            db.query(
                'INSERT INTO detalle_reserva (reserva_id, examen_id) VALUES ?',
                [detalles],
                (err2) => {
                    if (err2) return res.status(500).json({ error: 'Error al guardar exámenes' });
                    res.json({ ok: true, reserva_id });
                }
            );
        }
    );
});

// Modificar reserva
router.put('/:id', (req, res) => {
    const { fecha, hora } = req.body;
    db.query(
        'UPDATE reservas SET fecha = ?, hora = ? WHERE id = ?',
        [fecha, hora, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al modificar' });
            res.json({ ok: true });
        }
    );
});

// Cancelar reserva
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM detalle_reserva WHERE reserva_id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar detalles' });
        db.query('DELETE FROM reservas WHERE id = ?', [req.params.id], (err2) => {
            if (err2) return res.status(500).json({ error: 'Error al eliminar reserva' });
            res.json({ ok: true });
        });
    });
});

module.exports = router;