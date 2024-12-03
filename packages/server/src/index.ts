import express, { Request, Response } from "express";

import { PuzzlePage } from "./pages/puzzle";
import { LoginPage } from "./pages/auth";
import Puzzles from "./services/puzzle-svc";
import { connect } from "./services/mongo";
import puzzles from "./routes/puzzles";
import auth, { authenticateUser } from "./routes/auth";

import profiles from "./routes/profile";
import Profiles from "./services/profile-svc";

import fs from "node:fs/promises";
import path from "path";


const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("puzzle");

app.use(express.static(staticDir));
app.use(express.json());

// Redirect root path to /index.html if authenticated, or to /login if unauthenticated
app.get("/", authenticateUser, (req: Request, res: Response) => {
  res.redirect("/index.html");
});


app.use("/api/puzzles", authenticateUser, puzzles);
app.use("/api/profiles", authenticateUser, profiles);
app.use("/auth", auth);

// with the other HTML routes
app.get("/login", (req: Request, res: Response) => {
  const page = new LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});

app.get("/api/all-profiles", (req: Request, res: Response) => {
  Profiles.index()
    .then((profiles) => {
      res.status(200).json(profiles); // Respond with the profiles as JSON
    })
    .catch((error) => {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ error: "Failed to fetch profiles" });
    });
});

app.get("/profile/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;

  // Determine mode based on query parameters
  const mode =
    req.query["new"] !== undefined
      ? "new"
      : req.query.edit !== undefined
      ? "edit"
      : "view";

  if (mode === "new") {
    // Return a default profile for new creation
    const defaultProfile = {
      userid: userid,
      displayname: userid,
      avatar: "", // Default empty avatar
      catchphrase: "", // Default empty catchphrase
      puzzlessolved: 0, // Default value
    };

    Profiles.create(defaultProfile)
      .then((newProfile) => res.json(newProfile))
      .catch((error) => {
        console.error("Error creating new profile:", error);
        res.status(500).json({ error: "Failed to create new profile" });
      });
  } else {
    // Fetch existing profile data
    Profiles.get(userid)
      .then((data) => {
        if (!data) {
          // If no profile exists, create a default one
          const defaultProfile = {
            userid: userid,
            displayname: userid,
            avatar: "", // Default empty avatar
            catchphrase: "", // Default empty catchphrase
            puzzlessolved: 0, // Default value
          };

          return Profiles.create(defaultProfile).then(() => defaultProfile);
        }
        return data;
      })
      .then((profile) => res.json(profile)) // Return the profile
      .catch((error) => {
        console.error(`Error fetching or creating profile for ${userid}:`, error);
        res.status(500).json({ error: "Failed to fetch or create profile" });
      });
  }
});


app.put("/profile/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;
  const updates = req.body;

  Profiles.update(userid, updates)
    .then((updatedData) => {
      res.status(200).json(updatedData);
    })
    .catch((error) => {
      console.error(`Error updating user ${userid}:`, error);
      res.status(500).json({ error: "Failed to update profile" });
    });
});



app.get("/:levelId/:puzzleId", (req: Request, res: Response) => {
  const { levelId, puzzleId } = req.params;

  Puzzles.get(puzzleId).then((data) => {
    if (!data) {
      return res.status(404).send("Puzzle not found");
    }

    // Create an instance of PuzzlePage with the puzzle data
    const page = new PuzzlePage(data);
    
    // Call the instance's render() method
    res.set("Content-Type", "text/html").send(page.render());
  }).catch((err) => {
    res.status(500).send("Internal Server Error");
  });
});

// SPA Routes: /app/...
app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
    res.send(html)
  );
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});