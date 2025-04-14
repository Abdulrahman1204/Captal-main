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
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100,
    lowercase: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  dateOfCompany: {
    type: String,
    required: true,
  },
  lastYearRevenue: {
    type: String,
    required: true
  },
  requiredAmount: {
    type: String,
    required: true
  },
  attachedFile: {
    publicId: { type: String, default: null },
    url: { type: String, default: "" }
  },
  statusOrder: {
    type: String,
    enum: ["accepted", "not accepted", "pending"],
    default: "pending"
  },
  statusUser: {
    type: String,
    enum: ["visited", "eligible"], // visited = زائر، eligible = مسجل دخول
    default: "visited"
  },
  description: {
    type: String,
    default: "Write Notes",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }
}, {
  timestamps: true,
});

// Joi Validation for Create
function validationOrderFinance(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3).max(100).required(),
    lastName: Joi.string().trim().min(3).max(100).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    email: Joi.string().email().required(),
    companyName: Joi.string().trim().min(3).max(100).required(),
    dateOfCompany: Joi.string().required(),
    lastYearRevenue: Joi.string().required(),
    requiredAmount: Joi.string().required(),
    description: Joi.string().optional()
  });
  return schema.validate(obj);
}

// Joi Validation for Update
function validationUpdateOrderFinance(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3).max(100),
    lastName: Joi.string().trim().min(3).max(100),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
    email: Joi.string().email(),
    companyName: Joi.string().trim().min(3).max(100),
    dateOfCompany: Joi.string(),
    lastYearRevenue: Joi.string(),
    requiredAmount: Joi.string(),
    statusOrder: Joi.string().valid("accepted", "not accepted", "pending"),
    description: Joi.string()
  });
  return schema.validate(obj);
}

const OrderFinance = mongoose.model("OrderFinance", orderSchema);

module.exports = {
  OrderFinance,
  validationOrderFinance,
  validationUpdateOrderFinance
};
