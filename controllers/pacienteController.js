const db = require('../config/db');
const Paciente = require('../models/Paciente');

const listar = (req, res) => {
    db.query('SELECT * FROM pacientes', (err, filas) => {
        if (err) {
            res.status(500).json({ error: 'Error al listar pacientes' });
            return;
        } else {
            const pacientes = filas.map(f =>
                new Paciente(f.id, f.rut, f.nombre, f.apellido, f.fecha_nacimiento, f.telefono, f.correo)
            );
            res.json(pacientes);
        }
    });
};

const agregar = (req, res) => {
    const { rut, nombre, apellido, fecha_nacimiento, telefono, correo } = req.body;

    if (!rut || !nombre || !apellido) {
        res.status(400).json({ error: 'RUT, nombre y apellido son obligatorios' });
        return;
    }

    db.query(
        'INSERT INTO pacientes (rut, nombre, apellido, fecha_nacimiento, telefono, correo) VALUES (?, ?, ?, ?, ?, ?)',
        [rut, nombre, apellido, fecha_nacimiento, telefono, correo],
        (err, resultado) => {
            if (err) {
                res.status(500).json({ error: 'Error al agregar paciente' });
                return;
            }
            const nuevo = new Paciente(resultado.insertId, rut, nombre, apellido, fecha_nacimiento, telefono, correo);
            res.status(201).json(nuevo);
        }
    );
};

const editar = (req, res) => {
    const { id } = req.params;
    const { rut, nombre, apellido, fecha_nacimiento, telefono, correo } = req.body;

    db.query(
        'UPDATE pacientes SET rut = ?, nombre = ?, apellido = ?, fecha_nacimiento = ?, telefono = ?, correo = ? WHERE id = ?',
        [rut, nombre, apellido, fecha_nacimiento, telefono, correo, id],
        (err, resultado) => {
            if (err) {
                res.status(500).json({ error: 'Error al editar paciente' });
                return;
            }
            if (resultado.affectedRows === 0) {
                res.status(404).json({ error: 'Paciente no encontrado' });
                return;
            }
            res.json(new Paciente(id, rut, nombre, apellido, fecha_nacimiento, telefono, correo));
        }
    );
};

const eliminar = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM pacientes WHERE id = ?', [id], (err, resultado) => {
        if (err) {
            res.status(500).json({ error: 'Error al eliminar paciente' });
            return;
        }
        if (resultado.affectedRows === 0) {
            res.status(404).json({ error: 'Paciente no encontrado' });
            return;
        }
        res.json({ mensaje: 'Paciente eliminado' });
    });
};

module.exports = { listar, agregar, editar, eliminar };
