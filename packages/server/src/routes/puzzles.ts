import express, { Request, Response } from "express";
import { Puzzle } from "../models/puzzle";

import Puzzles from "../services/puzzle-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Puzzles.index()
    .then((list: Puzzle[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:name", (req: Request, res: Response) => {
  const { name } = req.params;

  Puzzles.get(name)
    .then((puzzle: Puzzle) => res.json(puzzle))
    .catch((err) => res.status(404).send(err));
});

router.put("/:name", (req: Request, res: Response) => {
  const { name } = req.params;
  const editedPuzzle = req.body;

  Puzzles.update(name, editedPuzzle)
    .then((puzzle: Puzzle) => res.json(puzzle))
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newPuzzle = req.body;

  Puzzles.create(newPuzzle)
    .then((puzzle: Puzzle) =>
      res.status(201).send(puzzle)
    )
    .catch((err) => res.status(500).send(err));
});

router.delete("/:name", (req: Request, res: Response) => {
  const { name } = req.params;

  Puzzles.remove(name)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;