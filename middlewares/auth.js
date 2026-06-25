function verificarAdmin(req, res, next) {
  if (req.session && req.session.rol === 'admin') {
    return next();
  }
  return res.status(403).send('Acceso denegado: solo administradores');
}

module.exports = { verificarAdmin };
