const superagent = require('superagent');
const TrailerListItem = require('../models/TrailerListItem');

class TrailerDAO {
  static search(searchTerm) {
    return superagent.get(`https://api.themoviedb.org/3/search/multi?query=${searchTerm}&api_key=${process.env.API_KEY}`)
              .then((response) => {
                const searchResultsData = response.body.results;
                const searchResults = [];
                searchResultsData.forEach((searchResultData) => {
                  const { media_type } = searchResultData;
                  if (media_type === 'tv' || media_type === 'movie') {
                    const trailerData = {
                      tmdb_id: searchResultData.id,
                      media_type,
                      title: searchResultData.name || searchResultData.title,
                    };
                    searchResults.push(trailerData);
                  }
                });
                return this.getVideoKeys(searchResults);
              })
              .then(response => response.map(trailerData => new TrailerListItem(trailerData)))
              .catch(err => err);
  }
  static getVideoKeys(trailers) {
    const getVideoData = trailers.map(trailer =>
      superagent.get(`https://api.themoviedb.org/3/${trailer.media_type}/${trailer.tmdb_id}/videos?api_key=${process.env.API_KEY}`)
                       .then((response) => {
                         const trailerWithVideo = trailer;
                         const videoData = response.body.results;
                         if (videoData.length > 0) {
                           trailerWithVideo.hasTrailer = true;
                           trailerWithVideo.videoSite = videoData[0].site;
                           trailerWithVideo.videoKey = videoData[0].key;
                           // TODO search through videos returned and find trailers if present
                           return trailerWithVideo;
                         }
                         trailerWithVideo.hasTrailer = false;
                         return trailerWithVideo;
                       })
                       .catch(err => err)
    );
    return Promise.all(getVideoData).then(videosData => videosData);
  }
  static getTrailerInfo(trailerID) {
    return superagent
      .get(`https://api.themoviedb.org/3/movie/${trailerID}?api_key=${process.env.API_KEY}&append_to_response=videos,credits`)
      .then(trailerDetails => trailerDetails.body)
      .catch(err => err);
  }
}

module.exports = TrailerDAO;
