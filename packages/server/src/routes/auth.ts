// src/routes/auth.js
import dotenv from "dotenv";
import express, {
  NextFunction,
  Request,
  Response
} from "express";
import jwt from "jsonwebtoken";

import Profile from "../services/profile-svc";
import credentials from "../services/credential-svc";

const router = express.Router();

dotenv.config();
const TOKEN_SECRET: string =
  process.env.TOKEN_SECRET || "NOT_A_SECRET";

  // in src/routes/auth.js
function generateAccessToken(
  username: string
): Promise<String> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
      TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token as string);
      }
    );
  });
}

  // in src/routes/auth.js
  router.post("/register", async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body; // from form
  
    if (!username || !password) {
      res.status(400).send("Bad request: Invalid input data.");
      return;
    }
  
    try {
      // Step 1: Create user credentials
      const creds = await credentials.create(username, password);
  
      // Step 2: Create a profile associated with the user
      const profile = {
        userid: username, // Use the ID from the created credentials
        displayname: username, // Default display name to username
        avatar: "/images/default-avatar.png", // Default avatar
        catchphrase: "", // Default catchphrase
        puzzlessolved: 5, // Initial solved puzzles count
      };
  
      await Profile.create(profile);
  
      // Step 3: Generate an access token for the user
      const token = generateAccessToken(creds.username);
  
      // Step 4: Respond with the generated token
      res.status(201).send({ token });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).send("Internal server error: Unable to register user.");
    }
  });

// in src/routes/auth.js
router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body; // from form

  if (!username || !password) {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    credentials
      .verify(username, password)
      .then((goodUser: string) => generateAccessToken(goodUser))
      .then((token) => res.status(200).send({ token: token }))
      .catch((error) => res.status(401).send("Unauthorized"));
  }
});

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).end();
  } else {
    jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
      if (decoded) next();
      else res.status(403).end();
    });
  }
}

export default router;