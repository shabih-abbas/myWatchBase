export function trimMovieDetails(details) {
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
  export function trimMovie(movie) {
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