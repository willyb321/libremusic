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

function loadSong(query) {
	searchTrack(query)
	.then(function (data) {

		const artist = data.results.trackmatches.track[0].artist;
		const name = data.results.trackmatches.track[0].name;
		document.getElementById("title").innerText = name + " - " + artist;
		


		getTrackInfo(artist,name)
		.then(function (data) {

			var mbid = data.track.mbid;
			var albumURL =  data.track.album.image[2]["#text"];
			$("." + mbid).remove();
		

			imgsrcToB64(albumURL)
			.then(art => {
				document.getElementById("album").src=art;


				document.getElementById("history").innerHTML =
				"<a class='card " + mbid + "' href='javascript:searchVideo(\""+name+" - "+artist+"\")'>"+
				"<img class='album' src='"+art+"'>"+
				"<br>"+
				"<div class='subtitle'>"+name+"<br>"+artist+"</div>"+
				"</a>"
				+ document.getElementById("history").innerHTML;


				localStorage.setItem("history", document.getElementById("history").innerHTML);


			})
			

		})
		.catch(function (data){
			console.error("Could not find album art for " + query);
			document.getElementById("album").src="album.png";
		})



	})
}
