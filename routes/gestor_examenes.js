const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    const sql = `
        SELECT MIN(ep.id) AS id, ep.rut_paciente, ep.nombre_paciente,
               GROUP_CONCAT(e.nombre SEPARATOR ', ') AS nombres_examenes,
               GROUP_CONCAT(ep.id SEPARATOR ',') AS ids_relacionados,
               ep.valor_bruto, ep.iva, ep.valor_neto,
               ep.bonif, ep.seguro, ep.copago, ep.fecha_toma
        FROM examenes_paciente ep
        LEFT JOIN examenes e ON e.id = ep.id_examen
        GROUP BY ep.rut_paciente, ep.fecha_toma, ep.valor_bruto, ep.iva, ep.valor_neto, ep.bonif, ep.seguro, ep.copago
        ORDER BY id DESC`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener registros' });
        res.json(results);
    });
});

router.post('/asignar', (req, res) => {
    const { rut_paciente, nombre_paciente, examenes, valor_bruto, iva, valor_neto, bonif, seguro, copago, fecha_toma } = req.body;

    if (!rut_paciente || !examenes || !examenes.length) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    const sql = 'INSERT INTO examenes_paciente (rut_paciente, nombre_paciente, id_examen, valor_bruto, iva, valor_neto, bonif, seguro, copago, fecha_toma) VALUES ?';
    const valores = examenes.map(id_examen => [rut_paciente, nombre_paciente, id_examen, valor_bruto, iva, valor_neto, bonif, seguro, copago, fecha_toma]);

    db.query(sql, [valores], (err) => {
        if (err) return res.status(500).json({ error: 'Error al guardar' });
        res.json({ ok: true });
    });
});

router.delete('/:ids', (req, res) => {
    const ids = req.params.ids.split(',').map(Number);
    db.query('DELETE FROM examenes_paciente WHERE id IN (?)', [ids], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar' });
        res.json({ ok: true });
    });
});

// GET /api/gestor_examenes/individuales — listar todos los exámenes individuales para gestión de resultados
router.get('/individuales', (req, res) => {
    const sql = `
        SELECT ep.id, ep.rut_paciente, ep.nombre_paciente,
               e.nombre AS nombre_examen, ep.resultado, ep.fecha_toma
        FROM examenes_paciente ep
        LEFT JOIN examenes e ON e.id = ep.id_examen
        ORDER BY ep.id DESC`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener registros individuales' });
        res.json(results);
    });
});

// GET /api/gestor_examenes/resultados-paciente — buscar resultados por RUT para el paciente
router.get('/resultados-paciente', (req, res) => {
    const { rut } = req.query;
    if (!rut) return res.status(400).json({ error: 'Falta RUT' });

    const sql = `
        SELECT ep.id, e.nombre AS nombre_examen, ep.fecha_toma, ep.resultado
        FROM examenes_paciente ep
        LEFT JOIN examenes e ON e.id = ep.id_examen
        WHERE ep.rut_paciente = ?
        ORDER BY ep.fecha_toma DESC, ep.id DESC`;
    db.query(sql, [rut], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al buscar resultados' });
        res.json(results);
    });
});

// PUT /api/gestor_examenes/resultado/:id — guardar o modificar resultado
router.put('/resultado/:id', (req, res) => {
    const { resultado } = req.body;
    db.query(
        'UPDATE examenes_paciente SET resultado = ? WHERE id = ?',
        [resultado, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al guardar el resultado' });
            res.json({ ok: true });
        }
    );
});

// DELETE /api/gestor_examenes/resultado/:id — eliminar/limpiar resultado (establecer en NULL)
router.delete('/resultado/:id', (req, res) => {
    db.query(
        'UPDATE examenes_paciente SET resultado = NULL WHERE id = ?',
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar el resultado' });
            res.json({ ok: true });
        }
    );
});

module.exports = router;