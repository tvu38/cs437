import express, { Request, Response } from "express";
import { PuzzlePage } from "./pages/puzzle";
import { getPuzzle } from "./services/puzzle-svc"

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.get(
  "/level-1/:puzzleId",
  (req: Request, res: Response) => {
    const { puzzleId } = req.params;
    const data = getPuzzle(puzzleId);
    const page = new PuzzlePage(data);

    res.set("Content-Type", "text/html").send(page.render());
  }
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});