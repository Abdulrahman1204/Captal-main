const mongoose = require("mongoose");
const Joi = require("joi");

const recourseUserOrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  recourseName: {
    type: String,
    required: true
  },
  recoursePhone: {
    type: String,
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  clientPhone: {
    type: String,
    required: true
  },
  serialNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  projectName: {
    type: String,
    required: true
  },
  dateOfproject: {
    type: Date,
    default: Date.now()
  },
  attachedFile: {
    publicId: { type: String, default: null },
    url: { type: String, default: "" },
  },
  materials: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Materials",
    default: null
  },
  paymentCheck: {
    type: String,
    enum: ["cash", "delayed"],
  },
  advance: {
    type: String,
    required: true,
  },
  uponDelivry: {
    type: String,
    required: true,
  },
  afterDelivry: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  countryName: {
    type: String,
    required: true,
  },
  postAddress: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  statusOrder: {
    type: String,
    enum: ["accepted", "not accepted", "pending"],
    default: "pending"
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      return ret;
    },
  },
});

// Joi Validation for creating/updating order
function validateRecourseUserOrder(obj) {
  const schema = Joi.object({
    userId: Joi.string(),
    recourseName: Joi.string().required(),
    recoursePhone: Joi.string().required(),
    clientName: Joi.string().required(),
    clientPhone: Joi.string().required(),
    serialNumber: Joi.number().required(),
    projectName: Joi.string().required(),
    dateOfproject: Joi.date(),
    attachedFile: Joi.object({
      publicId: Joi.string(),
      url: Joi.string()
    }),
    materials: Joi.string(),
    paymentCheck: Joi.string().valid("cash", "delayed"),
    advance: Joi.string().required(),
    uponDelivry: Joi.string().required(),
    afterDelivry: Joi.string().required(),
    country: Joi.string().required(),
    countryName: Joi.string().required(),
    postAddress: Joi.string().required(),
    street: Joi.string().required(),
  });
  return schema.validate(obj);
}

// validation update recourse order
function validateUpdateRecourseUserOrder(obj) {
  const schema = Joi.object({
    recourseName: Joi.string(),
    recoursePhone: Joi.string(),
    clientName: Joi.string(),
    clientPhone: Joi.string(),
    projectName: Joi.string(),
    dateOfproject: Joi.date(),
    attachedFile: Joi.object({
      publicId: Joi.string(),
      url: Joi.string()
    }),
    materials: Joi.string(),
    paymentCheck: Joi.string().valid("cash", "delayed"),
    advance: Joi.string(),
    uponDelivry: Joi.string(),
    afterDelivry: Joi.string(),
    country: Joi.string(),
    countryName: Joi.string(),
    postAddress: Joi.string(),
    street: Joi.string(),
  });
  return schema.validate(obj);
}

// Joi Validation for status update only
function validateStatusUpdate(obj) {
  const schema = Joi.object({
    statusOrder: Joi.string().valid("accepted", "not accepted", "pending").required()
  });
  return schema.validate(obj);
}

const RecourseUserOrder = mongoose.model("RecourseUserOrder", recourseUserOrderSchema);

module.exports = {
  RecourseUserOrder,
  validateRecourseUserOrder,
  validateUpdateRecourseUserOrder,  
  validateStatusUpdate
};