function requireAdmin(req, res, next) {
  const claims = req.user?.claims;
  if (claims?.role === "admin" || claims?.admin === true) {
    return next();
  }
  return res.status(403).json({ error: "Admin only" });
}

module.exports = requireAdmin;
