// controllers/organisationController.js
const Organisation = require("../Models/Organisation");
const jwt = require("jsonwebtoken");

// Helper to generate JWT
const generateToken = (org) => {
  return jwt.sign({ id: org._id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "7d",
  });
};

// @desc    Register a new organisation
// @route   POST /api/organisations/register
exports.registerOrganisation = async (req, res) => {
  try {
    const { name, city, phoneNumber, email, password, targetGroup } = req.body;

    const existing = await Organisation.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Organisation already exists" });
    }

    const organisation = new Organisation({
      name,
      city,
      phoneNumber,
      email,
      password,
      targetGroup,
    });

    await organisation.save();

    res.status(201).json({
      message: "Organisation registered successfully",
      organisation: {
        id: organisation._id,
        name: organisation.name,
        email: organisation.email,
      },
      token: generateToken(organisation),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Login organisation
// @route   POST /api/organisations/login
exports.loginOrganisation = async (req, res) => {
  try {
    const { email, password } = req.body;

    const organisation = await Organisation.findOne({ email });
    if (!organisation) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await organisation.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      organisation: {
        id: organisation._id,
        name: organisation.name,
        email: organisation.email,
      },
      token: generateToken(organisation),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get all organisations
// @route   GET /api/organisations
exports.getOrganisations = async (req, res) => {
  try {
    const organisations = await Organisation.find();
    res.json(organisations);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get organisation by ID
// @route   GET /api/organisations/:id
exports.getOrganisationById = async (req, res) => {
  try {
    const organisation = await Organisation.findById(req.params.id);
    if (!organisation) {
      return res.status(404).json({ message: "Organisation not found" });
    }
    res.json(organisation);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Update organisation
// @route   PUT /api/organisations/:id
exports.updateOrganisation = async (req, res) => {
  try {
    const updates = req.body;
    const organisation = await Organisation.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!organisation) {
      return res.status(404).json({ message: "Organisation not found" });
    }

    res.json({ message: "Organisation updated", organisation });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Delete organisation
// @route   DELETE /api/organisations/:id
exports.deleteOrganisation = async (req, res) => {
  try {
    const organisation = await Organisation.findByIdAndDelete(req.params.id);
    if (!organisation) {
      return res.status(404).json({ message: "Organisation not found" });
    }
    res.json({ message: "Organisation deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
