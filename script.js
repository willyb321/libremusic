// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '100%',
		width: '100%',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});

}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
		var prog = document.getElementById("myBar");
	var load = document.getElementById("loadBar");
	// changeSource()
	// event.target.playVideo();
	player.playVideo()

	var down = false;

	setInterval(function() {

		$(document).mousedown(function() {
		    down = true;
		}).mouseup(function() {
		    down = false;  
		});

		if (player.getPlayerState() == 1) {
			prog.style.width = player.getCurrentTime() / player.getDuration() * 100 + '%';
			load.style.width = player.getVideoLoadedFraction() * 100 + '%';
			if (player.getVideoLoadedFraction() > 0 && (!down)) {
				document.getElementById("progress").value = player.getCurrentTime()*100000/player.getDuration();
			} else if (!down){
				document.getElementById("progress").value = 0;
			}
		}

	}, 300);

}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
	/*if (event.data == YT.PlayerState.PLAYING && !done) {
		setTimeout(stopVideo, 6000);
		done = true;
	}*/
	
	if (player.getPlayerState() == 1) {
		document.getElementById("playPauseButton").src = "icons/pause.svg"
	}
}

// This function takes in a YouTube video id and changes
// the video on the page to this video
function changeSource(source) {
	var source = prompt('Video Id?');
	player.loadVideoById(source);
	progressBar();
	togglePlay();

}


// This function defines the rules for the progress bar
function progressBar(progress, loaded, total) {
	var prog = document.getElementById("myBar");
	var load = document.getElementById("loadBar");
	var handle = document.getElementById("progress");

	prog.style.width = progress;
	load.style.width = loaded;
	handle.value = progress;


}


// These functions change video settings when called
function fastForward(){
	player.seekTo(player.getCurrentTime() + 10);
}
function rewind(){
	player.seekTo(player.getCurrentTime() - 10);
}
function volumeUp(){
	player.setVolume(player.getVolume() + 10);
}
function volumeDown(){
	player.setVolume(player.getVolume() - 10);
}
function seek(ts){
	player.seekTo(ts.value/100000*player.getDuration(), true);
}

// These functions toggle video settings and change textures
function toggleMute(){
	if (player.isMuted()) {
		player.unMute()
		document.getElementById("toggleMuteButton").src = "icons/loud.svg"
	} else {
		player.mute()
		document.getElementById("toggleMuteButton").src = "icons/mute.svg"
	}
}

function togglePlay(){
	if (player.getPlayerState() == 1) {
		player.pauseVideo()
		document.getElementById("playPauseButton").src = "icons/play.svg"
	} else if (player.getPlayerState() == 2) {
		player.playVideo()
		document.getElementById("playPauseButton").src = "icons/pause.svg"
	}
}


// This function manages hotkeys

    	document.onkeydown= function (e) {
			e = e || window.event;

		    if (e.keyCode == '32' || e.keyCode == '75') { // 'SPACE' (pause)
		    	togglePlay()
		    }
		    if (e.keyCode == '37' || e.keyCode == '74'){ // 'LEFT' (rewind)
		    	rewind();
		    }
		    if (e.keyCode == '39' || e.keyCode == '76'){ // 'RIGHT' (forward)
		    	fastForward();
		    }
		    if (e.keyCode == '38'){ // 'UP' (volume up)
		    	volumeUp();
		    }
		    if (e.keyCode == '40'){ // 'DOWN' (volume down)
		    	volumeDown();
		    }
		    /*if (e.keyCode == '77'){ // 'M' (mute)
		    	toggleMute();
		    }*/
		
		}



// This function takes a video search query as input
// and changes the video to the first YouTube result
function searchVideo(query){
	var prog = document.getElementById("myBar");
	var load = document.getElementById("loadBar");

	
	player.pauseVideo();
	progressBar(0, 0, 0);

	document.getElementById("playPauseButton").src = "icons/play.svg"

	loadSong(query);
	
	console.log(query);

	searchTrack(query).then(function (data) {

		player.loadPlaylist({
			listType:"search",
			list:data.results.trackmatches.track[0].name + " - " + data.results.trackmatches.track[0].artist,
			index:0
		})
		
		
	})



}


function addToFavourites(){
	name = document.getElementById("title").innerText;
	artist = name.slice(name.indexOf("-")+1,name.length);
	name = name.slice(0,name.indexOf("-")-1);
	art = document.getElementById("album").src;

	document.getElementById("favourites").innerHTML =
				"<a class='card' href='javascript:searchVideo(\""+name+" - "+artist+"\")'>"+
				"<img class='album' src='"+art+"'>"+
				"<br>"+
				"<div class='subtitle'>"+name+"<br>"+artist+"</div>"+
				"</a>"
				+ document.getElementById("favourites").innerHTML;

	localStorage.setItem("favourites", document.getElementById("favourites").innerHTML);

}

function clearHistory(){
	localStorage.removeItem("history")
	document.getElementById("history").innerHTML = '';
}

async function imgsrcToB64(img) {
	return new Promise((resolve, reject) => {
		blobUtil.imgSrcToDataURL(img, 'image/png',
                         'Anonymous', 1.0).then(function (blob) {
			resolve(blob)
		}).catch(function (err) {
  			console.log(err)// error
		});
	})
}


