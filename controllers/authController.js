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
            req.session.usuario = filas[0].usuario;
            res.redirect('/admin');
        }
    );
};

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};

module.exports = { login, logout };
