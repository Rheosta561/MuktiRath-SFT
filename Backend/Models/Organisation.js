const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const organisationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"], // validation
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    targetGroup: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Hash password before save
organisationSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare passwords
organisationSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Organisation", organisationSchema);
