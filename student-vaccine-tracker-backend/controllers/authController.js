const User = require("../models/User");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = password;

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign(
      { username: newUser.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({ message: "User created successfully", token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      username: username,
      password: password,
    });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ username: username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login, register };
