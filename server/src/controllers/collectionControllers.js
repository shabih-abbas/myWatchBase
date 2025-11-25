import User from '../models/User.js';
export async function create(req, res) {
    const {name, user} = req.body;
    try{
        await User.findByIdAndUpdate(user, {
            $push:{
                collections: {
                    name: name,
                    movies: []
                }
            }
        })
        return res.status(201).json({message: "Collection Created"})
    }
    catch(err){
        return res.status(500).json({message: err.message})
    }
}
export async function deleteCollection(req, res){
    const {collection, user} = req.body;
    try{
        await User.findByIdAndUpdate(user, {
            $pull: {
                collections: {
                    _id: collection
                }
            }
        })
        return res.status(204).json({message: "Collection Deleted"})
    }
    catch(err){
        return res.status(500).json({message: err.message})
    }
}
export async function addMovie(req, res){
    const {collection, movie, user} = req.body;
    try{
        await User.findOneAndUpdate({_id: user, "collections._id": collection}, {
            $push: {
                "collections.$.movies": movie
            }
        })
        return res.status(201).json({message: "Movie Added"});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}
export async function deleteMovie(req, res){
    const {collection, movie, user} = req.body;
    try{
        await User.findOneAndUpdate({_id: user, "collections._id": collection}, {
            $pull: {
                "collections.$.movies": {id: movie}
            }
        })
        return res.status(204).json({message: "Movie Deleted"});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}
export async function getCollections(req, res){
    const {userId} = req.body;
    try{
        const user = User.findById(userId);
        if(!user) return res.status(404).json({message: "User Not Found"});
        return res.status(200).json({collections: user.collections});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}

