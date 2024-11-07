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
var puzzle_svc_exports = {};
__export(puzzle_svc_exports, {
  default: () => puzzle_svc_default
});
module.exports = __toCommonJS(puzzle_svc_exports);
var import_mongoose = require("mongoose");
const PuzzleSchema = new import_mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    level: { type: String, required: true, trim: true },
    solution_url: { type: String, required: true, trim: true },
    hint: { type: String, required: true, trim: true },
    flavor_text: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    featured_image: { type: String, required: false, trim: true }
  },
  { collection: "puzzles" }
);
const PuzzleModel = (0, import_mongoose.model)("Puzzle", PuzzleSchema);
function index() {
  return PuzzleModel.find();
}
function get(name) {
  return PuzzleModel.find({ name }).then((list) => list[0]).catch((err) => {
    throw `${name} Not Found`;
  });
}
function update(userid, puzzle) {
  return PuzzleModel.findOneAndUpdate({ userid }, puzzle, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${userid} not updated`;
    else return updated;
  });
}
function create(puzzle) {
  const p = new PuzzleModel(puzzle);
  return p.save();
}
function remove(userid) {
  return PuzzleModel.findOneAndDelete({ userid }).then(
    (deleted) => {
      if (!deleted) throw `${userid} not deleted`;
    }
  );
}
var puzzle_svc_default = { index, get, create, update, remove };
