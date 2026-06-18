const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'laboratorio'
});

db.connect((err) => {
    if (err) {
        console.error('Error de base de datos:', err.message);
        return;
    } else {
        console.log('Conexión a la base de datos exitosa');
    }
});

module.exports = db;
