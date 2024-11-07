import { Schema, model } from "mongoose";
import { Puzzle } from "../models";

const PuzzleSchema = new Schema<Puzzle>(
    {
        name: { type: String, required: true, trim: true },
        title: { type: String, required: true, trim: true },
        level: { type: String, required: true, trim: true },
        solution_url: { type: String, required: true, trim: true },
        hint: { type: String, required: true, trim: true },
        flavor_text: { type: String, required: true, trim: true },
        content: { type: String, required: true, trim: true },
        featured_image: { type: String, required: false, trim: true },
    },
    { collection: "puzzles" }
);

const PuzzleModel = model<Puzzle>("Puzzle", PuzzleSchema);

function index(): Promise<Puzzle[]> {
    return PuzzleModel.find();
  }
  
  function get(name: String): Promise<Puzzle> {
    return PuzzleModel.find({ name })
      .then((list) => list[0])
      .catch((err) => {
        throw `${name} Not Found`;
      });
  }
  
  export default { index, get };

/*
const puzzles = {
    colors: {
        name: "Colors",
        level: "level-1",
        solution_url: "/level-1/colors-solution.html",
        hint: "/level-1/colors-hint.html",
        flavor_text: "Eat me",
        content: "N/A",
        features_image: ""
    }
}

export function getPuzzle(_: string) {
    return puzzles["colors"];
}
*/