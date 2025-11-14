const tmdbOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: process.env.TMDB_KEY,
  },
};
export async function trending(req, res) {
  try {
    const tmdbRes = await fetch(
      process.env.TMDB_BASE_URL + "/trending/movie/week?language=en-US",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + process.env.TMDB_KEY,
        },
      }
    );
    const data = await tmdbRes.json();
    if (tmdbRes.ok) {
      const movies = data.results.map(trimMovie);
      return res.status(200).json({ movies: movies });
    } else {
      return res.status(502).json({ message: "Error with TMDB fetch" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
export async function movie(req, res) {
  const { id } = req.query;
  try {
    const tmdbRes = await fetch(
      `${process.env.TMDB_BASE_URL}/movie/${id}?append_to_response=credits,similar`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + process.env.TMDB_KEY,
        },
      }
    );
    if (tmdbRes.ok) {
      let details = await tmdbRes.json();
      details = trimMovieDetails(details);
      const omdbRes = await fetch(
        process.env.OMDB_BASE_URL + `i=${details.imdbId}`
      );
      if (omdbRes.ok) {
        const omdbDetails = await omdbRes.json();
        details = {
          ...details,
          externalRatings: omdbDetails.Ratings,
        };
      } else {
        console.log("omdb error");
      }
      return res.status(200).json({ movie: details });
    } else {
      return res.status(502).json({ message: "Error with TMDB fetch" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

function trimMovieDetails(details) {
  return {
    id: details.id,
    imdbId: details.imdb_id,
    title: details.title,
    releaseDate: details.release_date,
    rating: details.vote_average,
    ratingCount: details.vote_count,
    synopsis: details.overview,
    runtime: details.runtime,
    genres: details.genres,
    languages: details.spoken_languages.map((lang) => lang.english_name),
    backdrop: details.backdrop_path,
    poster: details.poster_path,
    credits: trimCredits(details.credits.cast),
    similar: details.similar.results.slice(0,2).map(trimMovie),
  };
}
function trimMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path,
    releaseDate: movie.release_date,
    rating: movie.vote_average,
  };
}
function trimCredits(cast) {
  var credits = {
    actors: [],
    directors: [],
    writers: [],
  }  
  for(const member of cast){
    const role = member.known_for_department;
    let memberTrimed= {
      id: member.id,
      name: member.name,
      profile: member.profile_path,
      character: member.character,
    }
    if(role == "Acting"){
      credits.actors.push(memberTrimed);
    }
    if(role == "Directing"){
      credits.directors.push(memberTrimed);
    }
    if(role == "Writing"){
      credits.writers.push(memberTrimed);
    }
  }
  return credits;
  }