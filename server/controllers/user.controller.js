const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

exports.createUser = async (req, res) => {
  const { username, lastName, firstName, password } = req.body;
  try {
    if (!username || !lastName || !firstName || !password) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    if (password.length < 8 || password.length > 20) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 8 characters long",
      });
    }
    if (username.length > 20 || firstName.length > 20 || lastName.length > 20) {
      return res.status(400).json({
        status: "error",
        message: "All fields must be less than 20 characters long",
      });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      username,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: { userId: newUser._id, username: newUser.username },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  const token = req.cookies.token;
  if (token) {
    return res.status(400).json({
      message: "You are already logged in",
    });
  }
  try {
    const findUser = await User.findOne({ username });
    if (!findUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: findUser._id, username: findUser.username },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "success",
      message: "User successfully logged in",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.signOut = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  return res.status(200).json({
    status: "success",
    message: "You are successfully signed out",
  });
};

exports.verifyToken = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(200).json({
        user: null,
      });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const rawQuery = req.query.query;
    const query = rawQuery.replace(/-/g, " ").trim();
    const searchWords = query.split(" ");
    const conditions = searchWords.map((word) => ({
      $or: [
        { firstName: { $regex: word, $options: "i" } },
        { lastName: { $regex: word, $options: "i" } },
        { username: { $regex: word, $options: "i" } },
      ],
    }));

    const users = await User.find({
      $and: conditions,
    }).select("-password");

    res.status(200).json({
      users,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
