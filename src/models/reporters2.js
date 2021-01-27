const mongoose = require("mongoose");
var validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const reportersSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
    validate(value) {
      if (value.includes("password")) {
        throw new Error("Passowrd cannot include same text as Email");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

reportersSchema.virtual("news", {
  ref: "News",
  localfield: "_id",
  foreignField: "owner",
});

reportersSchema.pre("save", async function (next) {
  const reporters = this;
  if (reporters.isModified(password)) {
    reporters.password = await bcrypt.hash(reporters.password, 8);
  }
  next();
});

reportersSchema.statics.findByCredentials = async (email, password) => {
  const reporters = await Reporters.findOne({ email: email });
  if (!reporters) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, reporters.password);
  if (!isMatch) {
    throw new Error("Incorrect Password");
  }
  return reporters;
};

reportersSchema.methods.generateToken = async function () {
  const reporters = this;
  const token = jwt.sign({ _id: reporters._id.toString() }, "news-app");

  reporters.tokens = reporters.tokens.concat({ token });
  await reporters.save();
  return token;
};

reportersSchema.methods.toJSON = function () {
  const reporters = this;
  const reporterObject = reporters.toObject();
  delete reporterObject.password;
  delete reporterObject.tokens;

  return reporterObject;
};

const Reporters = mongoose.model("Reporters", reportersSchema);

module.exports = Reporters;