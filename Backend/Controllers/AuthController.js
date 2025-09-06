const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

 const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const foundUser = await User.findOne({ phone: phoneNumber });
    if (!foundUser) {
      return res.status(400).json({
        message: "User not found",
        status: 400
      });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Access Denied",
        status: 401
      });
    }

    //  JWT with only essential info
    const generatedToken = jwt.sign(
      {user : foundUser}, 
      process.env.SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: "Access Granted",
      status: 200,
      user: foundUser,
      token: generatedToken
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      status: 500
    });
  }
};


const signup = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone: phoneNumber });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        status: 400,
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      phone: phoneNumber,
      password: hashedPassword,
    });
    console.log('new User', newUser);

    await newUser.save();

    // Sign JWT token with minimal info
    const generatedToken = jwt.sign(
      { user: { _id: newUser._id, phone: newUser.phone } },
      process.env.SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "User created successfully",
      status: 201,
      user: { _id: newUser._id, phone: newUser.phone },
      token: generatedToken,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      status: 500,
    });
  }
};


module.exports = {login , signup};
