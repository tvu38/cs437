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
      styles: [
        /* copied over from puzzlepage.css */
        import_server.css`
        h1 {
          font-size: var(--font-size-medium);
          border: 3px solid var(--color-text-body);
          margin-top: 30px;
          margin-bottom: 30px;
      }
      h2, h2 a {
          text-align: center;
          text-decoration: none;
          font-style: italic;
          color: var(--color-text-body);
          font-size: var(--font-size-small);
          margin-bottom: var(--margin-spacing);
      }
      h3 {
          text-align: center;
          margin_bottom: var(--margin-spacing);
      }
      .page img {
          display: grid;          /* Make the image a block element */
          grid-column: var(--grid-whole-span);
          margin: 0 auto;          /* Center the image horizontally */
          width: auto;            /* Adjust the width as needed */
          height: auto;            /* Maintain the aspect ratio */
      }
      `
      ],
      scripts: []
    });
  }
  renderBody() {
    const {
      name,
      title,
      solution_url,
      hint,
      flavor_text,
      content,
      featured_image
    } = this.data;
    const processedContent = content.replace(/\\n/g, "\n");
    return import_server.html`
    <body>
    <main class="page">
      <nav-bar>
        <a slot="hint" href=${hint}>Hint</a>
        <a slot="solution" href=${solution_url}>Solution</a>
      </nav-bar>
      <h1>${title}</h1>
      ${flavor_text ? import_server.html`<h2>${flavor_text}</h2>` : ""} <!-- Conditionally render flavortext -->
      ${processedContent ? import_server.html`<h3>${processedContent}</h3>` : ""} <!-- Conditionally render content -->
      ${featured_image ? import_server.html`<img src=${featured_image}>` : ""} <!-- Conditionally render content -->
    </main>
  </body> `;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PuzzlePage
});
