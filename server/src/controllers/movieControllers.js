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
          Authorization: 'Bearer ' + process.env.TMDB_KEY,
        },
      }
    );
    const data = await tmdbRes.json();
    if (tmdbRes.ok) {
      return res.status(200).json({ movies: data.results });
    } else {
      return res
        .status(502)
        .json({ message: "Error with TMDB fetch" + JSON.stringify(data) });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
export async function movie(req, res) {
  const { id } = req.query;
  try {
    const tmdbRes = await fetch(
      process.env.TMDB_BASE_URL + "/movie/" + id,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: 'Bearer ' + process.env.TMDB_KEY,
        },
      }
    );
    if (tmdbRes.ok) {
      let details = await tmdbRes.json();
      const omdbRes = await fetch(
        process.env.OMDB_BASE_URL + `i=${details.imdb_id}`
      );
      if (omdbRes.ok) {
        const omdbDetails = await omdbRes.json();
        details = {
          ...details,
          ratings: omdbDetails.Ratings,
        };
      }
      else{
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
