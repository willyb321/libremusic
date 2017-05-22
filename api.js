const api_key = "39b6e795e0e08c0448bb80df33231284"


function searchTrack(query){
	query = query.replace(" ", "+");
	return $.ajax({
		url:"http://ws.audioscrobbler.com/2.0/?method=track.search&track="+query+"&api_key="+api_key+"&format=json"
	})
}

function getTrackInfo(artist, track){
	return $.ajax({
		url:"http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key="+api_key+"&artist="+artist+"&track="+track+"&format=json"
	});
}


function getTopTracks(artist, track){
	return $.ajax({
		url:"http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key="+api_key+"&format=json"
	});
}

function loadSong(query) {
	searchTrack(query)
	.then(function (data) {

		const artist = data.results.trackmatches.track[0].artist;
		const name = data.results.trackmatches.track[0].name;
		document.getElementById("title").innerText = name + " - " + artist;
		


		getTrackInfo(artist,name)
		.then(function (data) {

			var mbid = 'h' + btoa((name+" - "+artist).match(/[\p{L}\s]+/g)).replace(/=/g,"");
			console.log(mbid);
			var albumURL =  data.track.album.image[2]["#text"];
			$("." + mbid).remove();

		

			imgsrcToB64(albumURL)
			.then(art => {
				document.getElementById("album").src=art;


				document.getElementById("history").innerHTML =
				"<a class='card " + mbid + "' href='javascript:searchVideo(\""+name.replace("'","")+" - "+artist+"\")'>"+
				"<img class='album' src='"+art+"'>"+
				"<br>"+
				"<div class='subtitle'>"+name+"<br>"+artist+"</div>"+
				"</a>"
				+ document.getElementById("history").innerHTML;

			})
			

		})
		.catch(function (data){
			var mbid = 'h' + btoa((name+" - "+artist).match(/[\p{L}\s]+/g)).replace(/=/g,"");
			console.log(mbid)
			$("." + mbid).remove();
			console.error("Could not find album art for " + query);

			if ($("." + mbid.replace("h","p")) != null){
				art = $("." + mbid.replace("h","p"))[0].firstChild.src;
			} else {
				art = "album.png"
			}
			document.getElementById("album").src=art;
			

			document.getElementById("history").innerHTML =
				"<a class='card " + mbid + "' href='javascript:searchVideo(\""+name.replace("'","")+" - "+artist+"\")'>"+
				"<img class='album' src='"+art+"'>"+
				"<br>"+
				"<div class='subtitle'>"+name+"<br>"+artist+"</div>"+
				"</a>"
				+ document.getElementById("history").innerHTML;
		})

		localStorage.setItem("history", document.getElementById("history").innerHTML);


	})
}


function addToFavourites(){
	searchTrack(document.getElementById("title").innerText)
	.then(function (data) {

		// Define artist and name from API
		const artist = data.results.trackmatches.track[0].artist;
		const name = data.results.trackmatches.track[0].name;

		// Get album art url from loaded album art
		art = document.getElementById("album").src;
		// Create unique song ID
		var mbid = 'f' + btoa((name+" - "+artist).match(/[\p{L}\s]+/g)).replace(/=/g,"");
		// Remove existing songs with the same ID
		$("." + mbid).remove();

		// Add new favourites card
		document.getElementById("favourites").innerHTML =
		"<a class='card " + mbid + "' href='javascript:searchVideo(\""+name.replace("'","")+" - "+artist+"\")'>"+
		"<img class='album' src='"+art+"'>"+
		"<br>"+
		"<div class='subtitle'>"+name+"<br>"+artist+"</div>"+
		"</a>"
		+ document.getElementById("favourites").innerHTML;

		// Save new favourites
		localStorage.setItem("favourites", document.getElementById("favourites").innerHTML);
	})
}

function loadTopTracks(){

	getTopTracks()
	.then(function(data){
		html = '';
		for (i=0;i<8;i++){
			name = data.tracks.track[i].name;
			artist = data.tracks.track[i].artist.name;
			art = data.tracks.track[i].image[2]["#text"];
			console.log(art)

			var mbid = 'p' + btoa((name+" - "+artist).match(/[\p{L}\s]+/g)).replace(/=/g,"");


			html = html +
			"<a class='card " + mbid + "' href='javascript:searchVideo(\""+name.replace("'","")+" - "+artist+"\")'>"+
			"<img class='album' src='"+art+"'>"+
			"<br>"+
			"<div class='subtitle'>"+name+"<br>"+artist+"</div>"+
			"</a>"
			;

		}
		document.getElementById("popular").innerHTML = html;
		
	})

}