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

function setAlbumArt(query) {
	searchTrack(query)
	.then(function (data) {

		const artist = data.results.trackmatches.track[0].artist;
		const name = data.results.trackmatches.track[0].name;



		getTrackInfo(artist,name)
		.then(function (data) {

			var albumArt =  data.track.album.image[2]["#text"];
			console.info("Loaded " + albumArt);
			document.getElementById("album").src=albumArt;

			imgsrcToB64(document.getElementById("album"))
			.then(art => {
				setLStorage(name + ' - ' + artist, art)
				document.getElementById("album").src=art;
			console.log(art);
			})
			historySize = document.getElementById("history").getElementsByTagName('a').length;
			console.log(historySize);

			setCookie("history" + historySize, name + " - " + artist, 365);
			setCookie("historyLength", historySize+1, 365);


		})
		.catch(function (data){
			console.error("Could not find album art for " + query);
			document.getElementById("album").src="album.png";
		})



	})
}

async function populateHistory(query) {
	const imgUrl = await getLStorage(query);
	console.log(imgUrl)
	searchTrack(query)
	.then(function (data) {

		const artist = data.results.trackmatches.track[0].artist;
		const name = data.results.trackmatches.track[0].name;

		getTrackInfo(artist,name)
		.then(function (data) {

			var albumArt =  data.track.album.image[2]["#text"];
			var albumArt = imgUrl || data.track.album.image[2]["#text"];
			console.info("Loaded " + albumArt);

			document.getElementById("history").innerHTML =
			"<a class='card' href='javascript:searchVideo(\""+name+" - "+artist+"\")'>"+
			"<img class='album' src='"+albumArt+"'>"+
			"<br>"+
			"<div class='subtitle'>"+name+"<br>"+artist+"</div>"+
			"</a>"
			+ document.getElementById("history").innerHTML;




		})
		.catch(function (data){
			console.error("Could not find album art for " + query);
			document.getElementById("history").innerHTML =
			"<a class='card' href='javascript:searchVideo(\""+name+" - "+artist+"\")'>"+
			"<img class='album' src='album.png'>"+
			"<br>"+
			"<div class='subtitle'>"+name+"<br>"+artist+"</div>"+
			"</a>"
			+ document.getElementById("history").innerHTML;

		})



	})

}



function setTitle(query,id) {
	searchTrack(query)
	.then(function (data) {
		document.getElementById(id).innerText = data.results.trackmatches.track[0].name + " - " + data.results.trackmatches.track[0].artist;

	})
	.catch(function(data){
		console.error("Could not find " + query);
	})
}
