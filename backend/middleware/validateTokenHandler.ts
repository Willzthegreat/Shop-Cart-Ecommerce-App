// import { Request, Response, NextFunction } from "express";
// import asyncHandler from "express-async-handler";
// import jwt from "jsonwebtoken";


// interface JwtPayload {
//   user: {
//     id: string;
//   };
// }


// interface AuthRequest extends Request {
//   user?: {
//     id: string;
//   };
// }


// export const validateToken = asyncHandler(
//   async (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction
//   ) => {

//     let token: string | undefined;


//     const authHeader =
//       req.headers.authorization ||
//       req.headers.Authorization;


//     if (
//       authHeader &&
//       typeof authHeader === "string" &&
//       authHeader.startsWith("Bearer ")
//     ) {

//       token = authHeader.split(" ")[1];


//       if (!token) {
//         res.status(401);
//         throw new Error("Not authorized, no token");
//       }


//       try {

//         const decoded = jwt.verify(
//           token,
//           process.env.ACCESS_TOKEN_SECRET as string
//         ) as JwtPayload;


//         req.user = decoded.user;


//         next();


//       } catch (error) {

//         res.status(401);

//         throw new Error(
//           "Not authorized, token failed"
//         );

//       }


//     } else {

//       res.status(401);

//       throw new Error(
//         "Not authorized, no token"
//       );
//     }
//   }
// );


// export default validateToken;