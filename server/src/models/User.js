import mongoose from 'mongoose';
const movieSchema = new mongoose.Schema({
    _id: false,
    id: {type: Number, required: true},
    title: {type: String, required: true},
    poster: {type: String, default: null},
    releaseDate: {type: String, required: true},
    rating: {type: Number, required: true},
});
const collectionSchema = new mongoose.Schema({
    name: {type: String, required: true},
    movies: {type: [movieSchema], default: []}
})
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    collections: {type: [collectionSchema], default: []}
})

export default mongoose.model("User", userSchema);