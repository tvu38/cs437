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
var import_auth = require("./pages/auth");
var import_puzzle_svc = __toESM(require("./services/puzzle-svc"));
var import_mongo = require("./services/mongo");
var import_puzzles = __toESM(require("./routes/puzzles"));
var import_auth2 = __toESM(require("./routes/auth"));
var import_profile = __toESM(require("./routes/profile"));
var import_profile_svc = __toESM(require("./services/profile-svc"));
var import_promises = __toESM(require("node:fs/promises"));
var import_path = __toESM(require("path"));
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
(0, import_mongo.connect)("puzzle");
app.use(import_express.default.static(staticDir));
app.use(import_express.default.json());
app.get("/", import_auth2.authenticateUser, (req, res) => {
  res.redirect("/index.html");
});
app.use("/api/puzzles", import_auth2.authenticateUser, import_puzzles.default);
app.use("/api/profiles", import_auth2.authenticateUser, import_profile.default);
app.use("/auth", import_auth2.default);
app.get("/login", (req, res) => {
  const page = new import_auth.LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});
app.get("/api/all-profiles", (req, res) => {
  import_profile_svc.default.index().then((profiles2) => {
    res.status(200).json(profiles2);
  }).catch((error) => {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ error: "Failed to fetch profiles" });
  });
});
app.get("/profile/:userid", (req, res) => {
  const { userid } = req.params;
  const mode = req.query["new"] !== void 0 ? "new" : req.query.edit !== void 0 ? "edit" : "view";
  if (mode === "new") {
    const defaultProfile = {
      userid,
      displayname: userid,
      avatar: "",
      // Default empty avatar
      catchphrase: "",
      // Default empty catchphrase
      puzzlessolved: 0
      // Default value
    };
    import_profile_svc.default.create(defaultProfile).then((newProfile) => res.json(newProfile)).catch((error) => {
      console.error("Error creating new profile:", error);
      res.status(500).json({ error: "Failed to create new profile" });
    });
  } else {
    import_profile_svc.default.get(userid).then((data) => {
      if (!data) {
        const defaultProfile = {
          userid,
          displayname: userid,
          avatar: "",
          // Default empty avatar
          catchphrase: "",
          // Default empty catchphrase
          puzzlessolved: 0
          // Default value
        };
        return import_profile_svc.default.create(defaultProfile).then(() => defaultProfile);
      }
      return data;
    }).then((profile) => res.json(profile)).catch((error) => {
      console.error(`Error fetching or creating profile for ${userid}:`, error);
      res.status(500).json({ error: "Failed to fetch or create profile" });
    });
  }
});
app.put("/profile/:userid", (req, res) => {
  const { userid } = req.params;
  const updates = req.body;
  import_profile_svc.default.update(userid, updates).then((updatedData) => {
    res.status(200).json(updatedData);
  }).catch((error) => {
    console.error(`Error updating user ${userid}:`, error);
    res.status(500).json({ error: "Failed to update profile" });
  });
});
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
app.use("/app", (req, res) => {
  const indexHtml = import_path.default.resolve(staticDir, "index.html");
  import_promises.default.readFile(indexHtml, { encoding: "utf8" }).then(
    (html) => res.send(html)
  );
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
