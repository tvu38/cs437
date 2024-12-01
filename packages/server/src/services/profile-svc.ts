import { Schema, model } from "mongoose";
import { Profile } from "../models/profile";

const profileSchema = new Schema<Profile>(
  {
    userid: { type: String, required: true, trim: true },
    avatar: {
        data: Buffer,
        contentType: String
      },
    catchphrase: { type: String, required: false, trim: true },
    puzzlessolved: { type: Number, required: true, trim: true},
  },
  { collection: "profiles" }
);

const ProfileModel = model<Profile>(
  "profile",
  profileSchema
);

function index(): Promise<Profile[]> {
  return ProfileModel.find();
}

function get(userid: String): Promise<Profile> {
  return ProfileModel.find({ userid })
    .then((list) => list[0])
    .catch(() => {
      throw `${userid} Not Found`;
    });
}

function update(
  userid: String,
  profile: Profile
): Promise<Profile> {
  return ProfileModel.findOneAndUpdate({ userid }, profile, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${userid} Not Found`;
    else return updated as Profile;
  });
}

function create(profile: Profile): Promise<Profile> {
  const p = new ProfileModel(profile);
  return p.save();
}

function remove(userid: String): Promise<void> {
  return ProfileModel
    .findOneAndDelete({ userid })
    .then((deleted) => {
      if (!deleted) throw `${userid} not deleted`;
    });
}

export default { index, get, create, update, remove };