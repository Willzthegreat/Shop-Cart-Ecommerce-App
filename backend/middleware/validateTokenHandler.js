import AsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

export const validateToken = AsyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
      req.user = decoded.user;
      next();
    });

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

  }


//   try {
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     req.user = decoded.user;
//     next();
//   } catch (error) {
//     res.status(401);
//     throw new Error("Not authorized, token failed");
//   }
});



// export default validateToken;