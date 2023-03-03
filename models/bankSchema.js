const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
    },

    dob: {
      type: Date,
      required: true,
    },
    initialBalance: {
      type: Number,
      default: 0,
    },
    adhaarNo: {
      type: Number,
    },
    panNo: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
