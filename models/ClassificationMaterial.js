const mongoose = require("mongoose");
const Joi = require("joi");

const classificationMaterialSchema = new mongoose.Schema(
  {
    fatherName: {
      type: String,
      required: true,
    },
    sonName: {
      type: String,
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

// Units
classificationMaterialSchema.virtual("materialss", {
  ref: "Matrials",  // يجب أن يتطابق مع اسم المودل
  foreignField: "classification",
  localField: "_id",
});

// validation create classficationMaterial
function validationClassficationMatrials(obj) {
  const schema = Joi.object({
    fatherName: Joi.string().required(),
    sonName: Joi.string(),
  });
  return schema.validate(obj);
}

const ClassificationMaterial = mongoose.model(
  "classificationMaterial",
  classificationMaterialSchema
);

module.exports = {
  ClassificationMaterial,
  validationClassficationMatrials,
};
