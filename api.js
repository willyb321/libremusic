const apiKey = '39b6e795e0e08c0448bb80df33231284'

function searchTrack (query) {
  query = query.replace(' ', '+')
  return $.ajax({
    url: 'https://ws.audioscrobbler.com/2.0/?method=track.search&track=' + query + '&api_key=' + apiKey + '&format=json'
  })
}

function getTrackInfo (artist, track) {
  return $.ajax({
    url: 'https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=' + apiKey + '&artist=' + artist + '&track=' + track + '&format=json'
  })
}

function getTopTracks (artist, track) {
  return $.ajax({
    url: 'https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=' + apiKey + '&format=json'
  })
}

function loadSong (query) {
  searchTrack(query)
    .then(function (data) {
      const artist = data.results.trackmatches.track[0].artist
      const name = data.results.trackmatches.track[0].name
      document.getElementById('title').innerText = name + ' - ' + artist

      for (var n = 0; n < $('#favourites')[0].children.length; n++) {
        if ($('#favourites')[0].children[n].lastChild.innerText === name + '\n' + artist) {
          document.getElementById('favourite').src = 'icons/favouritegold.svg'
          break
        } else {
          document.getElementById('favourite').src = 'icons/favourite.svg'
        }
      }

      getTrackInfo(artist, name)
        .then(function (data) {
          var mbid = 'h' + makeID(artist, name)
          console.log(mbid)
          var albumURL = data.track.album.image[2]['#text']

          $('.' + mbid).remove()

          imgsrcToB64(albumURL)
            .then(art => {
              document.getElementById('album').src = art
              document.getElementById('history').innerHTML =
                "<a class='card " + mbid + "' href='javascript:searchVideo(\"" + name.replace("'", '') + ' - ' + artist + "\")'>" +
                "<img class='album' src='" + art + "'>" +
                '<br>' +
                "<div class='subtitle'>" + name + '<br>' + artist + '</div>' +
                '</a>' +
                document.getElementById('history').innerHTML

              localStorage.setItem('history', document.getElementById('history').innerHTML)
            })
        })
        .catch(function (data) {
          var mbid = 'h' + makeID(artist, name)
          console.log(mbid)
          $('.' + mbid).remove()
          console.error('Could not find album art for ' + query)

          if ($('.' + mbid.replace('h', 'p')) != null) {
            art = $('.' + mbid.replace('h', 'p'))[0].firstChild.src
          } else {
            art = 'album.png'
          }
          document.getElementById('album').src = art

          document.getElementById('history').innerHTML =
            "<a class='card " + mbid + "' href='javascript:searchVideo(\"" + name.replace("'", '') + ' - ' + artist + "\")'>" +
            "<img class='album' src='" + art + "'>" +
            '<br>' +
            "<div class='subtitle'>" + name + '<br>' + artist + '</div>' +
            '</a>' +
            document.getElementById('history').innerHTML

          localStorage.setItem('history', document.getElementById('history').innerHTML)
        })
    })
}

function addToFavourites () {
  if (player.getPlayerState() === 1 || player.getPlayerState() === 2) {
    searchTrack(document.getElementById('title').innerText)
      .then(function (data) {
        // Define artist and name from API
        const artist = data.results.trackmatches.track[0].artist
        const name = data.results.trackmatches.track[0].name

        // Get album art url from loaded album art
        var art = document.getElementById('album').src
        // Create unique song ID
        var mbid = 'f' + makeID(artist, name)
        // Remove existing songs with the same ID
        $('.' + mbid).remove()

        // Add new favourites card
        document.getElementById('favourites').innerHTML =
          "<a class='card " + mbid + "' href='javascript:searchVideo(\"" + name.replace("'", '') + ' - ' + artist + "\")'>" +
          "<img class='album' src='" + art + "'>" +
          '<br>' +
          "<div class='subtitle'>" + name + '<br>' + artist + '</div>' +
          '</a>' +
          document.getElementById('favourites').innerHTML

        if ((document.getElementById('favourite').src).endsWith('icons/favourite.svg')) {
          document.getElementById('favourite').src = 'icons/favouritegold.svg'
        } else if ((document.getElementById('favourite').src).endsWith('icons/favouritegold.svg')) {
          document.getElementById('favourite').src = 'icons/favourite.svg'
          $('.' + mbid).remove()
        }

        // Save new favourites
        localStorage.setItem('favourites', document.getElementById('favourites').innerHTML)
      })
  }
}

function loadTopTracks () {
  getTopTracks()
    .then(function (data) {
      var html = ''
      for (var z = 0; z < 16; z++) {
        var name = data.tracks.track[z].name
        var artist = data.tracks.track[z].artist.name
        var art = data.tracks.track[z].image[2]['#text']

        var mbid = 'p' + makeID(artist, name)

        html = html +
          "<a class='card " + mbid + "' href='javascript:searchVideo(\"" + name.replace("'", '') + ' - ' + artist + "\")'>" +
          "<img class='album' src='" + art + "'>" +
          '<br>' +
          "<div class='subtitle'>" + name + '<br>' + artist + '</div>' +
          '</a>'
      }
      document.getElementById('popular').innerHTML = html
    })
}

function makeID (artist, name) {
  var conv = ''
  var str = artist + name
  for (var i = 0; i < str.length; i++) {
    conv += str.charCodeAt(i)
  }
  conv = btoa(parseInt(conv))
  conv = conv.replace(/=/g, '-')
  return conv
}
