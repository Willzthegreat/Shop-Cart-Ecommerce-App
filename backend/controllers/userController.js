import asyncHandler from "express-async-handler";
import User from "../../modern-ecommerce-app/models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



//@desc Register a new user
//@route POST /api/users/register
//@access Public

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("Hashed password:", hashedPassword);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log("Created user:", user);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  };

  // Logic for user registration
  res.status(201).json({ message: "User registered successfully" });
});


//@desc Login user
//@route POST /api/users/login
//@access Public

export const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  } 

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});


//@desc current user information
//@route GET /api/users/current
//@access Private

export const getCurrentUser = asyncHandler(async (req, res) => {
  // Logic for getting current user information
  res.status(200).json(req.user);
});



