export const requireAdmin = (req, res, next) => {
  const user = req.user;

  if (user?.admin === true || user?.role === "admin") {
    return next();
  }

  // console.warn(`🚫 Access denied for user: ${user?.email}`);
  return res.status(403).json({ error: "Admin only access" });
};
