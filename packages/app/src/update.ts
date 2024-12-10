// src/update.ts
import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./message";
import { Model } from "./model";
import { Puzzle, Profile } from "server/models"; 

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "profile/select":
      selectProfile(message[1], user).then((profile) =>
      apply((model) => ({ ...model, profile }))
    );
    break;

    case "puzzle/select":
        selectPuzzle(message[1], user).then((puzzle) =>
          apply((model) => ({ ...model, puzzle }))
        );
        break;

    case "profile/save":
          saveProfile(message[1], user)
            .then((profile) =>
              apply((model) => ({ ...model, profile }))
            )
            .then(() => {
              const { onSuccess } = message[1];
              if (onSuccess) onSuccess();
            })
            .catch((error: Error) => {
              const { onFailure } = message[1];
              if (onFailure) onFailure(error);
            });
          break;
    
    // put the rest of your cases here
    default:
      const unhandled: never = message[0];
      throw new Error(`Unhandled Auth message "${unhandled}"`);
  }
}

function saveProfile(
  msg: {
    userid: string;
    profile: Profile;
  },
  user: Auth.User
) {
  return fetch(`/api/profiles/${msg.userid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(msg.profile)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      else
        throw new Error(
          `Failed to save profile for ${msg.userid}`
        );
    })
    .then((json: unknown) => {
      if (json) return json as Profile;
      return undefined;
    });
}


function selectPuzzle(
    msg: { puzzleid: string },
    user: Auth.User
  ) {
    const src = `/api/puzzles/${msg.puzzleid}`;
    console.log("MY NEW THING:", src);

    return fetch(src, {
      headers: Auth.headers(user)
    })
      .then((response: Response) => {
        if (response.status === 200) {
            console.log(response.status);
          return response.json();
        }
        return undefined;
      })
      .then((json: unknown) => {
        if (json) {
          console.log("Puzzle:", json);
          return json as Puzzle;
        }
      });
  }

async function selectProfile(
    msg: { userid: string },
    user: Auth.User
  ) {
    return fetch(`/api/profiles/${msg.userid}`, {
      headers: Auth.headers(user)
    })
      .then((response: Response) => {
        if (response.status === 200) {
          return response.json();
        }
        return undefined;
      })
      .then((json: unknown) => {
        if (json) {
          console.log("Profile:", json);
          return json as Profile;
        }
      });
  }