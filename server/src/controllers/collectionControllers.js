import User from "../models/User.js";
export async function create(req, res) {
  const { user } = req;
  const { name } = req.body;
  
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
    if (updatedUser){
      return res.status(201).json({
        collections: updatedUser.collections,
        message: "Collection Created",
      });
    }
    else return res.status(404).json({ message: "User Not Found" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
export async function deleteCollection(req, res) {
  const { user } = req;
  const { collection } = req.params;
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
      return res.status(200).json({
        collections: updatedUser.collections,
        message: "Collection Deleted"
      });
    else return res.status(404).json({ message: "User Not Found" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
export async function addMovie(req, res) {
  const { user } = req;
  const { collection, movie } = req.body;
  const {id, title, poster, rating, releaseDate} = movie;
  const trimmedMovie = {id, title, poster, rating, releaseDate};
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user, "collections._id": collection },
      {
        $push: {
          "collections.$.movies": trimmedMovie,
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
  const { user } = req;
  const { collection, movie } = req.body;
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
        .status(200)
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
  const { user } = req;
  try {
    const found = await User.findById(user);
    if (!found) return res.status(404).json({ message: "User Not Found" });
    return res.status(200).json({ collections: found.collections });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
