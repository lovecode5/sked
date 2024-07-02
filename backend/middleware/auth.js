import jwt from "jsonwebtoken";

const auth = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, "Is1807");
      req.user = decoded.user;

      // Check if user role is authorized
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ msg: "Access denied" });
      }

      next();
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  };
};

export default auth;
