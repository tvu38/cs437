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
var pages_exports = {};
__export(pages_exports, {
  HomePage: () => HomePage
});
module.exports = __toCommonJS(pages_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class HomePage {
  data;
  mode;
  constructor(data, mode) {
    this.data = data;
    this.mode = mode;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      stylesheets: [],
      styles: [],
      scripts: [`
          import { define, Auth } from "@calpoly/mustang";
          import { PuzzleList } from "/scripts/puzzlelist.js";
          import { NavBarElement } from "/scripts/navbar.js";
          import { TravelerProfileElement } from "/scripts/profile.js";
  
          define ({
              "puzzle-list": PuzzleList,
              "nav-bar": NavBarElement,
              "mu-auth": Auth.Provider,
              "complex-profile-name": TravelerProfileElement
          })
  
          NavBarElement.initializeOnce();
          `]
    });
  }
  renderBody() {
    const base = "/profile";
    const api = this.data ? `profile/${this.data.userid}` : "base";
    return import_server.html`
          <body>
    <mu-auth provides ="puzzles:auth">
    <main class="page">

        <nav-bar></nav-bar>

        <complex-profile-name src="${api}" mode="${this.mode}"></complex-profile-name>

    <!-- <script src="/scripts/navbar.js"></script> --> 

   <div class="inner-box">
    <!-- Container for centering SVG files -->

    <div class="homepagetitle" >
        <h1>Funny Puzzle Hunt :P</h1>
    </div>

    <div class="icon-container">
        <svg class="icon">
            <use href="/icons/puzzlepiece.svg#icon-piece" />
        </svg>
        <svg class="icon">
            <use href="/icons/puzzlepiece.svg#icon-piece" />
        </svg>
        <svg class="icon">
            <use href="/icons/puzzlepiece.svg#icon-thinking" />
        </svg>
        <svg class="icon">
            <use href="/icons/puzzlepiece.svg#icon-piece" />
        </svg>
        <svg class="icon">
            <use href="/icons/puzzlepiece.svg#icon-piece" />
        </svg>
    </div>
    
        <div class="grid-container">
            <puzzle-list>
                <span slot="level">Level 1 Puzzles</span>
                <a slot="item-1" href="level-1/colors">Colors</a>
                <a slot="item-2" href="level-1/answer-yoohoo">Just Look Up</a>
                <a slot="item-3" href="level-1/aplusbequalsc">A+B=C</a>
                <a slot="item-4" href="level-1/time">Time</a>
                <a slot="item-5" href="level-1/1-3-puzzle">1/3 Puzzle</a>
        </puzzle-list>
        <puzzle-list>
                <span slot="level">Level 2 Puzzles</span>
                <a slot="item-1" href="level-2/not-without-precedent">Not Without Precedent</a>
                <a slot="item-2" href="level-2/lunchable-gatorade">Lunchables Gatorade</a>
                <a slot="item-3" href="level-2/nyc-subway">NYC Subway</a>
                <a slot="item-4" href="level-2/blank-squares">Blank Squares</a>
                <a slot="item-5" href="level-2/2-3-puzzle.html">2/3 Puzzle</a>
            </puzzle-list>
            <puzzle-list>
                <span slot="level">Level 3 Puzzles</span>
                <a slot="item-1" href="level-3/lele.html">LELE!</a>
                <a slot="item-2" href="level-3/obligatory-connections-puzzle.html">Obligatory Connections Puzzle</a>
                <a slot="item-3" href="level-3/three-crosses.html">Three Crosses</a>
                <a slot="item-4" href="level-3/blank-spaces.html">Blank Spaces</a>
                <a slot="item-5" href="level-3/list-of-really-really-really-stupid-article-ideas.html">List of really, really, really stupid article ideas</a>
            </puzzle-list>
            <puzzle-list>
                <span slot="level">Level 4 Puzzles</span>
                <a slot="item-1" href="level-4/the-puzzle-that-gives-back.html">The Puzzle That Gives Back</a>
                <a slot="item-2" href="level-4/path.html">Path</a>
                <a slot="item-3" href="level-4/generational-gifts.html">Generational Gifts</a>
                <a slot="item-4" href="level-4/all-the-moves.html">All the Moves</a>
                <a slot="item-5" href="level-4/50-50.html">50/50</a></li>
            </puzzle-list>
        </div>
    </main>
</mu-auth>
  </body> `;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HomePage
});
