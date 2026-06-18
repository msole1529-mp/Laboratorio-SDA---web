const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'sda-laboratorio-secret',
    resave: false,
    saveUninitialized: false
}));

// Rutas API
const pacientesRouter = require('./routes/pacientes');
app.use('/api/pacientes', pacientesRouter);

// Rutas autenticación
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

// Vista pública
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Panel admin (protegido)
app.get('/admin', (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/login.html');
    }
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor SDA corriendo en localhost:${PORT}`);
});
