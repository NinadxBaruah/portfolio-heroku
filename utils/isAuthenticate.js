const jwt = require("jsonwebtoken");
const tokenString = require("../db/authToken")

const isAuthenticate = async (req, res, next) => {
  const authToken = req.cookies.__authToken;

  const createToken = await tokenString.create({token:authToken})

  if (!authToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(authToken, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.log("error: Token has expired");
        const authLog = await tokenString.create({logs:err})
        return res.status(401).json({ message: "Token expired" });
      } else if (err.name === "JsonWebTokenError") {
        console.log("error: Invalid token");
        const authLog = await tokenString.create({logs:err})
        return res.status(403).json({ message: "Invalid token" });
      } else if (err.name === "NotBeforeError") {
        console.log("error: Token not active");
        const authLog = await tokenString.create({logs:err})
        return res.status(403).json({ message: "Token not yet active" });
      } else {
        console.log("error:", err);
        const authLog = await tokenString.create({logs:err})
        return res.status(403).json({ message: "Forbidden", error:err });
      }
    }

    // Proceed if verification is successful
    req.user = user.userId;
    next();
  });
};

module.exports = isAuthenticate;
