"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var puzzle_exports = {};
__export(puzzle_exports, {
  PuzzlePage: () => PuzzlePage
});
module.exports = __toCommonJS(puzzle_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class PuzzlePage {
  data;
  constructor(data) {
    this.data = data;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      stylesheets: [],
      styles: [],
      scripts: []
    });
  }
  renderBody() {
    const {
      name,
      solution_url,
      hint,
      flavor_text,
      content,
      featured_image
      /* , etc */
    } = this.data;
    return import_server.html`
    <body>
    <main class="page">
      <nav-bar>
        <a slot="hint" href=${hint}>Hint</a>
        <a slot="solution" href=${solution_url}>Solution</a>
      </nav-bar>
      <h1>${name}</h1>
      <h2>${flavor_text}</h2>
      <h3>${content}</h3>
    </main>
  </body> `;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PuzzlePage
});
