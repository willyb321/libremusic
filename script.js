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
		height: '390',
		width: '640',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});

}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	// changeSource()
	// event.target.playVideo();
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
    	document.getElementById( "title" ).innerText = player.getVideoData().title;
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
function progressBar(progress, total) {
	var prog = document.getElementById("myBar");
	var load = document.getElementById("loadBar");
	setInterval(() => {
		prog.style.width = player.getCurrentTime() / player.getDuration() * 100 + '%';
		load.style.width = player.getVideoLoadedFraction() * 100 + '%';
		if (player.getVideoLoadedFraction() > 0) {
			document.getElementById("progress").value = player.getCurrentTime()*100000/player.getDuration();
		} else {
			document.getElementById("progress").value = 0;
		}
	}, 300);


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
	} else {
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
    if (e.keyCode == '77'){ // 'M' (mute)
    	toggleMute();
    }
};


// This function takes a video search query as input
// and changes the video to the first YouTube result
function searchVideo(query){
	togglePlay();
	console.log(query);
	player.loadPlaylist({
		listType:"search",
		list:query,
		index:0
	})
	progressBar();
	setCookie("query", query, 365);
	document.getElementById("history").innerHTML += "<a href='javascript:searchVideo(\"" + getCookie("query") + "\")'>" + getCookie("query") + "</a><br>";
}



// Cookie function code - courtesy of w3schools.com
//
// Source from May 2017: https://www.w3schools.com/js/js_cookies.asp

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}