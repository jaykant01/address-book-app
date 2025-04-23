const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
    },
    address: {
      type: String,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    pincode: {
      type: String,
    },
    category: {
      type: String,
      enum: ["Family", "Friends", "Office", "Other"],
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Contact", contactSchema)
