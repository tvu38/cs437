import { Profile, Puzzle } from "server/models";

export interface Model {
  puzzle?: Puzzle;
  profile?: Profile;
}

export const init: Model = {};