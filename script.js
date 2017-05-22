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
		    if (player.getPlayerState() == 2) {
		    	prog.style.width = document.getElementById("progress").value/1000 + '%';
		    }

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

	}, 100);

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



	if (player.getPlayerState() == 0) {
		player.stopVideo();
		progressBar(0,0,0);
		document.getElementById("album").src = "album.png";
		document.getElementById("title").innerText = "";
		document.getElementById("playPauseButton").src = "icons/play.svg"

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

function toggleVideo(){

		if (document.getElementById("player").style.visibility == "hidden" && (player.getPlayerState() == 1 || player.getPlayerState() == 2)){
			document.getElementById("youtubeactive").style.pointerEvents = "none"
			document.getElementById("youtube").style.pointerEvents = "none"
			document.getElementById("player").style.visibility = "visible"
			document.getElementById("youtubeactive").style.visibility = "visible"
			$('#player').fadeIn('fast', function() {
				document.getElementById("clickShield").style.visibility = "visible";
			});
			$('#youtubeactive').fadeIn('fast', function() {
				document.getElementById("youtube").style.visibility = "hidden"
				document.getElementById("youtubeactive").style.pointerEvents = "all"
				document.getElementById("youtube").style.pointerEvents = "all"
			});
			

		} else if (player.getPlayerState() >= 0){
			document.getElementById("youtubeactive").style.pointerEvents = "none"
			document.getElementById("youtube").style.pointerEvents = "none"
			document.getElementById("clickShield").style.visibility = "hidden"
			$('#player').fadeOut('fast', function() {
	   		 document.getElementById("player").style.visibility = "hidden"

	   		 		$('#youtubeactive').fadeOut('fast', function() {
			   			document.getElementById("youtubeactive").style.visibility = "hidden"
			   			document.getElementById("youtubeactive").style.pointerEvents = "all"
						document.getElementById("youtube").style.pointerEvents = "all"
					});
				document.getElementById("youtube").style.visibility = "visible"
			});

			
			
		}

}


