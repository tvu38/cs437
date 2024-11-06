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
var puzzlelist_svc_exports = {};
__export(puzzlelist_svc_exports, {
  getPuzzlelist: () => getPuzzlelist
});
module.exports = __toCommonJS(puzzlelist_svc_exports);
const puzzlelists = {
  "level-1": {
    level: "Level 1 Puzzles",
    puzzles: [
      { title: "Colors", url: "level-1/colors.html" },
      { title: "Just Look Up", url: "level-1/answer-yoohoo.html" },
      { title: "A+B=C", url: "level-1/aplusbequalsc.html" },
      { title: "Time", url: "level-1/time.html" },
      { title: "1/3 Puzzle", url: "level-1/1-3-puzzle.html" }
    ]
  },
  "level-2": {
    level: "Level 2 Puzzles",
    puzzles: [
      { title: "Not Without Precedent", url: "level-2/not-without-precedent.html" },
      { title: "Lunchables Gatorade", url: "level-2/lunchable-gatorade.html" },
      { title: "NYC Subway", url: "level-2/nyc-subway.html" },
      { title: "Blank Squares", url: "level-2/blank-squares.html" },
      { title: "2/3 Puzzle", url: "level-2/2-3-puzzle.html" }
    ]
  }
};
function getPuzzlelist(_) {
  return puzzlelists["level-1"];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getPuzzlelist
});
