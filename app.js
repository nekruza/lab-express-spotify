require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });


  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

app.get('/', (req, res) => {
    // console.log(`this is homepage`)
    res.render('index')
  });


app.get('/artist-search', (req, res)=>{

    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      // console.log('The received data from the API: ', data.body.artists);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    //   res.send('hree is your artist' + req.query.search)
      res.render('artist-search-results', data.body.artists.items)
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  
})


app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data=>{
    // console.log(data.body.items);
    res.render('albums', data.body.items)
  })  
});


app.get('/tracks/:trackId', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.trackId)
  .then(data=>{
    res.render('tracks', data.body.items)
  })
});





app.listen(3016, () => console.log('My Spotify project running on port 3016 🎧 🥁 🎸 🔊'));