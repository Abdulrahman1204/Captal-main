const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Schema
const orderSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: v => /^[0-9]{10}$/.test(v),
      message: props => `${props.value} is not a valid 10-digit phone number!`,
    }
  },
  email: {
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 100,
  },
  companyName: {
    type: String,
    trim: true,
  },
  dateOfCompany: {
    type: String,
  },
  lastYearRevenue: {
    type: String,
  },
  requiredAmount: {
    type: String,
  },
  attachedFile: {
    publicId: { type: String, default: null },
    url: { type: String, default: "" }
  },
  statusOrder: {
    type: String,
    enum: ["accepted", "an invoice has been issued", "shipped","delivered" ,"pending","not accepted"],
    default: "pending"
  },
  statusUser: {
    type: String,
    enum: ["visited","eligible"],
    default: "visited"
  },
  description: {
    type: String,
    default: "Write Notes",
  }
}, {
  timestamps: true,
});

// Joi Validation Schemas
function validationOrderQualification(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3).max(100).required(),
    lastName: Joi.string().trim().min(3).max(100).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    email: Joi.string().email().min(5).max(100).allow(""),
    companyName: Joi.string().trim().allow(""),
    dateOfCompany: Joi.date().allow(""),
    lastYearRevenue: Joi.string().allow(""),
    requiredAmount: Joi.string().allow(""),
    description: Joi.string().optional()
  });
  return schema.validate(obj);
}

function validationUpdateOrderQualification(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3).max(100),
    lastName: Joi.string().trim().min(3).max(100),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
    email: Joi.string().email(),
    companyName: Joi.string().trim().allow(""),
    dateOfCompany: Joi.date().allow(""),
    lastYearRevenue: Joi.string().allow(""),
    requiredAmount: Joi.string().allow(""),
    statusOrder: Joi.string().valid("accepted", "an invoice has been issued", "shipped","delivered" ,"pending","not accepted"),
    description: Joi.string()
  });
  return schema.validate(obj);
}

const OrderQualification = mongoose.model("OrderQualification", orderSchema);

module.exports = {
  OrderQualification,
  validationOrderQualification,
  validationUpdateOrderQualification
};
