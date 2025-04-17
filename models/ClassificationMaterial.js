const mongoose = require("mongoose");
const Joi = require("joi");



// classification Material Father Schema
const classificationMaterialFatherSchema = new mongoose.Schema(
  {
    fatherName: {
      type: String,
      required: true,
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


// classification Material Son Schema
const classificationMaterialSonSchema = new mongoose.Schema(
  {
    fatherName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classificationMaterialFather",
      default: null,
    },
    sonName: {
      type: String,
      required: true,
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
classificationMaterialFatherSchema.virtual("materialss", {
  ref: "Matrials",  // يجب أن يتطابق مع اسم المودل
  foreignField: "classification",
  localField: "_id",
});


// validation create classficationMaterialFather
function validationClassficationMatrialsFather(obj) {
  const schema = Joi.object({
    fatherName: Joi.string().required(),
  });
  return schema.validate(obj);
}
// validation create classficationMaterialSon
function validationClassficationMatrialsSon(obj) {
  const schema = Joi.object({
    fatherName: Joi.string().required(),
    sonName: Joi.string().required(),
  });
  return schema.validate(obj);
}
// validation create classficationMaterialSon
function validationUpdateClassficationMatrialsSon(obj) {
  const schema = Joi.object({
    fatherName: Joi.string(),
    sonName: Joi.string(),
  });
  return schema.validate(obj);
}

const classificationMaterialFather = mongoose.model(
  "classificationMaterialFather",
  classificationMaterialFatherSchema
);

const classificationMaterialSon = mongoose.model(
  "classificationMaterialSon",
  classificationMaterialSonSchema
);

module.exports = {
  classificationMaterialSon,
  classificationMaterialFather,
  validationClassficationMatrialsFather,
  validationClassficationMatrialsSon,
  validationUpdateClassficationMatrialsSon
};
