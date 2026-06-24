// Middleware untuk memastikan user sudah login
function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/login');
}

// Middleware khusus untuk role 'penghuni'
function isPenghuni(req, res, next) {
  if (req.session.user && req.session.user.role === 'penghuni') {
    return next();
  }
  return res.status(403).send('Akses ditolak. Halaman ini hanya untuk penghuni kos.');
}

// Middleware khusus untuk role 'admin'
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).send('Akses ditolak. Halaman ini hanya untuk admin.');
}

module.exports = { isLoggedIn, isPenghuni, isAdmin };
