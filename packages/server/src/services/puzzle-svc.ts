import { Puzzle } from "../models";

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