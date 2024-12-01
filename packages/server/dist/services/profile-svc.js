"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var profile_svc_exports = {};
__export(profile_svc_exports, {
  default: () => profile_svc_default
});
module.exports = __toCommonJS(profile_svc_exports);
var import_mongoose = require("mongoose");
const profileSchema = new import_mongoose.Schema(
  {
    userid: { type: String, required: true, trim: true },
    avatar: {
      data: Buffer,
      contentType: String
    },
    catchphrase: { type: String, required: false, trim: true },
    puzzlessolved: { type: Number, required: true, trim: true }
  },
  { collection: "profiles" }
);
const ProfileModel = (0, import_mongoose.model)(
  "profile",
  profileSchema
);
function index() {
  return ProfileModel.find();
}
function get(userid) {
  return ProfileModel.find({ userid }).then((list) => list[0]).catch(() => {
    throw `${userid} Not Found`;
  });
}
function update(userid, profile) {
  return ProfileModel.findOneAndUpdate({ userid }, profile, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${userid} Not Found`;
    else return updated;
  });
}
function create(profile) {
  const p = new ProfileModel(profile);
  return p.save();
}
function remove(userid) {
  return ProfileModel.findOneAndDelete({ userid }).then((deleted) => {
    if (!deleted) throw `${userid} not deleted`;
  });
}
var profile_svc_default = { index, get, create, update, remove };
