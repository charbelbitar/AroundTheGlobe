function requireAuth(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin privileges required' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
