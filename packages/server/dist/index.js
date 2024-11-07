"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_express = __toESM(require("express"));
var import_puzzle = require("./pages/puzzle");
var import_puzzle_svc = __toESM(require("./services/puzzle-svc"));
var import_mongo = require("./services/mongo");
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
(0, import_mongo.connect)("puzzle");
app.use(import_express.default.static(staticDir));
app.get("/:levelId/:puzzleId", (req, res) => {
  const { levelId, puzzleId } = req.params;
  import_puzzle_svc.default.get(puzzleId).then((data) => {
    if (!data) {
      return res.status(404).send("Puzzle not found");
    }
    const page = new import_puzzle.PuzzlePage(data);
    res.set("Content-Type", "text/html").send(page.render());
  }).catch((err) => {
    res.status(500).send("Internal Server Error");
  });
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
