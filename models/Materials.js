const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Schema
const matrialSchema = new mongoose.Schema(
  {
    materialName: {
      type: String,
      required: true,
      trim: true,
    },
    serialNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    classification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classificationMaterialFather",
      required: true,
    },
    attachedFile: {
      publicId: { type: String, default: null },
      url: { type: String, default: "" },
    },
  },
  {
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
  }
);

// Joi Validation
function validationMatrialsOrder(obj) {
  const schema = Joi.object({
    materialName: Joi.string().required(),
    serialNumber: Joi.number().required(),
    classification: Joi.string().required(),
    // categories: Joi.array().items(Joi.string()).min(1).required(),
  });
  return schema.validate(obj);
}

function validationUpdateMatrialsOrder(obj) {
  const schema = Joi.object({
    materialName: Joi.string(),
    serialNumber: Joi.number(),
    classification: Joi.string(),
    // categories: Joi.array().items(Joi.string()),
  });
  return schema.validate(obj);
}

const Materials = mongoose.model("Matrials", matrialSchema);
module.exports = {
  Materials,
  validationMatrialsOrder,
  validationUpdateMatrialsOrder,
};
