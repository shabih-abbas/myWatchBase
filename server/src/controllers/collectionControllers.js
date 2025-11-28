import { trimMovie } from "../utiles.js";
import User from "../models/User.js";
export async function create(req, res) {
  const { name, user } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      user,
      {
        $push: {
          collections: {
            name: name,
            movies: [],
          },
        },
      },
      { new: true }
    );
    if (updatedUser)
      return res.status(201).json({
        collections: updatedUser.collections,
        message: "Collection Created",
      });
    else return res.status(404).json({ message: "User Not Found" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
export async function deleteCollection(req, res) {
  const { collection, user } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      user,
      {
        $pull: {
          collections: {
            _id: collection,
          },
        },
      },
      { new: true }
    );
    if (updatedUser)
      return res.status(204).json({
        collections: updatedUser.collections,
        message: "Collection Deleted",
      });
    else return res.status(404).json({ message: "User Not Found" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
export async function addMovie(req, res) {
  const { collection, movie, user } = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user, "collections._id": collection },
      {
        $push: {
          "collections.$.movies": trimMovie(movie),
        },
      },
      { new: true, runValidators: true }
    );
    if (updatedUser)
      return res
        .status(201)
        .json({ collections: updatedUser.collections, message: "Movie Added" });
    else return res.status(404).json({ message: "User not found" });
  } catch (err) {
    if(err.code == 11000) return res.status(400).json({message: "Movie already exists"})
    return res.status(500).json({ message: err.message });
  }
}
export async function deleteMovie(req, res) {
  const { collection, movie, user } = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user, "collections._id": collection },
      {
        $pull: {
          "collections.$.movies": { id: movie },
        },
      },
      { new: true }
    );
    if (updatedUser)
      return res
        .status(204)
        .json({
          collections: updatedUser.collections,
          message: "Movie Deleted",
        });
    else return res.status(404).json({message: 'User not found'})
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
export async function getCollections(req, res) {
  const { userId } = req.body;
  try {
    const user = User.findById(userId);
    if (!user) return res.status(404).json({ message: "User Not Found" });
    return res.status(200).json({ collections: user.collections });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
