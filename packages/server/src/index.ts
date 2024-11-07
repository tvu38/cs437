import express, { Request, Response } from "express";
import { PuzzlePage } from "./pages/puzzle";
import Puzzles from "./services/puzzle-svc";
import { connect } from "./services/mongo";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("puzzle");

app.use(express.static(staticDir));

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


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});