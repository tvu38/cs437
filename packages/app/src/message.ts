import { Profile, Puzzle } from "server/models";

export type Msg =
  | ["profile/save", { userid: string; profile: Profile }]
  | ["puzzle/save", { userid: string; puzzle: Puzzle }]
  | ["profile/select", { userid: string }]
  | ["puzzle/select", { puzzleid: string }];