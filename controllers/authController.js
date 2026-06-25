const db = require('../config/db');

const login = (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.redirect('/login.html?error=1');
    }

    db.query(
        'SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?',
        [usuario, contrasena],
        (err, filas) => {
            if (err) {
                return res.redirect('/login.html?error=1');
            }
            if (filas.length === 0) {
                return res.redirect('/login.html?error=1');
            }

            // ✅ Guardamos usuario y rol en la sesión
            req.session.usuario = filas[0].usuario;
            req.session.rol = filas[0].rol || 'user'; 
            // si tu tabla tiene columna 'rol', úsala; si no, por defecto será 'user'

            // Redirige según el rol
            if (req.session.rol === 'admin') {
                return res.redirect('/admin.html');
            } else {
                return res.redirect('/index.html');
            }
        }
    );
};

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
};

module.exports = { login, logout };
