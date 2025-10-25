import jwt from "jsonwebtoken";

/**

 
 * - Verifies JWT using secret key
 * - Attaches decoded user info to req.user
 */
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check header exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; 

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user info to request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email, 
    };

    next(); // pass control to next middleware/route
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
