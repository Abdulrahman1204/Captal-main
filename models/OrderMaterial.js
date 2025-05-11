const mongoose = require("mongoose");
const joi = require("joi");

// MaterialsOrder Schema
const materialsOrder = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      maxLength: 40,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 10,
    },
    companyName: {
      type: String,
      trim: true,
    },
    dateOfCompany: {
      type: String,
      trim: true,
    },
    materials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Matrials",
        default: null,
      },
    ],
    noteForQuantity: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    statusOrder: {
      type: String,
      enum: ["accepted", "an invoice has been issued", "shipped","delivered" ,"pending","not accepted"],
      default: "pending"
    },
    statusUser: {
      type: String,
      enum: ["visited", "eligible"],
      default: "visited",
    },
    attachedFile: {
      publicId: { type: String, default: null },
      url: { type: String, default: "" },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create Validation
const validateCreateMatrialOrder = (obj) => {
  const schema = joi.object({
    firstName: joi.string().trim().min(2).max(100).required(),
    lastName: joi.string().trim().min(2).max(100).required(),
    email: joi.string().trim().min(8).max(100).email().required(),
    phone: joi.string().length(10).required(),
    companyName: joi.string().trim().allow(""),
    dateOfCompany: joi.string().trim().allow(""),
    materials: joi
      .array()
      .items(joi.string().trim()),
    noteForQuantity: joi.string().trim().allow(""),
    description: joi.string().trim().allow(""),
  });

  return schema.validate(obj);
};

// Update Validation
const validateUpdateMatrialOrder = (obj) => {
  const schema = joi.object({
    firstName: joi.string().trim().min(2).max(100),
    lastName: joi.string().trim().min(2).max(100),
    email: joi.string().trim().min(8).max(100).email(),
    phone: joi.string().length(10),
    companyName: joi.string().trim().allow(""),
    dateOfCompany: joi.string().trim().allow(""),
    materials: joi.array().items(joi.string().trim()),
    noteForQuantity: joi.string().trim().allow(""),
    description: joi.string().trim().allow(""),
    statusOrder: joi.string().valid("accepted", "an invoice has been issued", "shipped","delivered" ,"pending","not accepted"),
  });

  return schema.validate(obj);
};

// MaterialsOrder Model
const MaterialsOrder = mongoose.model("MaterialsOrder", materialsOrder);

module.exports = {
  MaterialsOrder,
  validateCreateMatrialOrder,
  validateUpdateMatrialOrder,
};
