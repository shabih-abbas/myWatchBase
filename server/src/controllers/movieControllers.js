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
      return res.status(502).json({ message: "Error with TMDB fetch"});
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
export async function search(req, res){
  const {query, page} = req.query;
  try{
    const tmdbRes = await fetch(
      `${process.env.TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + process.env.TMDB_KEY,
        },
      }
    );
    if (tmdbRes.ok){
      const data = await tmdbRes.json();
      const movies = data.results.map(trimMovie);
      return res.status(200).json({movies, currentPage: data.page, totalPages: data.total_pages});
    }
    else{
      return res.status(502).json({ message: "Error with TMDB fetch" });
    }
  }
  catch(err){
    return res.status(500).json({message: err});
  }
}
export async function filters(req, res){
  const filterOptions = {
    sort: [
      {name: 'Asc Popularity' , value: 'popularity.asc'},
      {name: 'Desc Popularity' , value: 'popularity.desc'},
      {name: 'Asc Release Date' , value: 'primary_release_date.asc'},
      {name: 'Desc Release Date', value: 'primary_release_date.desc'},
      {name: 'Asc Rating' , value: 'vote_average.asc'},
      {name: 'Desc Rating' , value: 'vote_average.desc'},
      {name: 'Asc Vote Count' , value: 'vote_count.asc'},
      {name: 'Desc Vote Count' , value: 'vote_count.desc'},
    ],
    ratings: Array.from({length: 9}, (_, i) => i+1).map(rating => ({name: '> '+rating, value: rating})),
    releaseDate: Array.from({length: 10}, (_, i) => (Math.floor(new Date().getFullYear()/10) * 10) - (i*10)).map(year => ({name: '> ' + year, value: year + '-01'+'-01'})),
    languages: [],
    genres: [],
  }

  try{
    const langRes = await fetch(
      `${process.env.TMDB_BASE_URL}/configuration/languages`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + process.env.TMDB_KEY,
        },
      }
    );
    const genreRes = await fetch(
      `${process.env.TMDB_BASE_URL}/genre/movie/list`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + process.env.TMDB_KEY,
        },
      }
    );
    if(langRes.ok){
      const data = await langRes.json();
      filterOptions.languages = data;
    }
    if(genreRes.ok){
      const data = await genreRes.json();
      filterOptions.genres = data.genres;
    }
    return res.status(200).json(filterOptions);
  }
  catch(err){
    return res.status(500).json({message: err});
  }
}

export async function discover(req, res){
  const params = new URLSearchParams(req.query);
  try{
    const tmdbRes = await fetch(
      `${process.env.TMDB_BASE_URL}/discover/movie?${params.toString()}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + process.env.TMDB_KEY,
        },
      }
    ); 
    if(tmdbRes.ok){
      const data  = await tmdbRes.json();
      const movies = data.results.map(trimMovie);
      return res.status(200).json({movies, currentPage: data.page, totalPages: data.total_pages, totalResults: data.total_results})
    }
    else{
      return res.status(502).json({ message: "Error with TMDB fetch" });
    }
  }
  catch(err){
    return res.status(500).json({message: err.message});
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