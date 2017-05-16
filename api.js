function searchTrack(query){
	query = query.replace(" ", "+");
	return $.ajax({
		url:"http://ws.audioscrobbler.com/2.0/?method=track.search&track=" + query + "&api_key=39b6e795e0e08c0448bb80df33231284&format=json"
	})
}

function getTrackInfo(artist, track){
	return $.ajax({
		url:"http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=39b6e795e0e08c0448bb80df33231284&artist=" + artist + "&track=" + track + "&format=json"
	});
}

function setAlbumArt(query) {
	searchTrack(query).then(function (data) {
		getTrackInfo(data.results.trackmatches.track[0].artist,data.results.trackmatches.track[0].name).then(function (data) {
			var albumArt =  data.track.album.image[2]["#text"];
			console.log(albumArt);
			var album = document.getElementById("album");
			album.src=albumArt;

			
		})
	})
}

function setTitle(query,id) {
	searchTrack(query).then(function (data) {
		document.getElementById(id).innerText = data.results.trackmatches.track[0].name + " - " + data.results.trackmatches.track[0].artist;
	


	})
}