const tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;

function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '100%',
		width: '100%',
		events: {
			onReady: onPlayerReady,
			onStateChange: onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {
	const prog = document.getElementById('myBar');
	const load = document.getElementById('loadBar');

	player.playVideo();

	let down = false;

	setInterval(() => {
		$(document).mousedown(() => {
			down = true;
		}).mouseup(() => {
			down = false;
			if (player.getPlayerState() === 2) {
				prog.style.width = document.getElementById('progress').value / 1000 + '%';
			}
		});

		if (player.getPlayerState() === 1) {
			prog.style.width = player.getCurrentTime() / player.getDuration() * 100 + '%';
			load.style.width = player.getVideoLoadedFraction() * 100 + '%';
			if (player.getVideoLoadedFraction() > 0 && (!down)) {
				document.getElementById('progress').value = player.getCurrentTime() * 100000 / player.getDuration();
			} else if (!down) {
				document.getElementById('progress').value = 0;
			}
		}
	}, 100);
}

function onPlayerStateChange(event) {
	if (player.getPlayerState() === 1) {
		document.getElementById('playPauseButton').src = 'icons/pause.svg';
	}

	if (player.getPlayerState() === 0) {
		player.stopVideo();
		progressBar(0, 0, 0);
		document.getElementById('album').src = 'album.png';
		document.getElementById('title').innerText = '';
		document.getElementById('playPauseButton').src = 'icons/play.svg';
	}

	if (player.getPlayerState() === 5) {
		document.getElementById('youtubeactive').style.pointerEvents = 'none';
		document.getElementById('youtube').style.pointerEvents = 'none';
		document.getElementById('clickShield').style.visibility = 'hidden';
		$('#player').fadeOut('fast', () => {
			document.getElementById('player').style.visibility = 'hidden';
			$('#youtubeactive').fadeOut('fast', () => {
				document.getElementById('youtubeactive').style.visibility = 'hidden';
				document.getElementById('youtubeactive').style.pointerEvents = 'all';
				document.getElementById('youtube').style.pointerEvents = 'all';
			});
			document.getElementById('youtube').style.visibility = 'visible';
		});
	}
}

// This function defines the rules for the progress bar
function progressBar(progress, loaded, total) {
	const prog = document.getElementById('myBar');
	const load = document.getElementById('loadBar');
	const handle = document.getElementById('progress');

	prog.style.width = progress;
	load.style.width = loaded;
	handle.value = progress;
}

// These functions change video settings when called
function fastForward() {
	player.seekTo(player.getCurrentTime() + 10);
}

function rewind() {
	player.seekTo(player.getCurrentTime() - 10);
}

function volumeUp() {
	player.setVolume(player.getVolume() + 10);
}

function volumeDown() {
	player.setVolume(player.getVolume() - 10);
}

function seek(ts) {
	player.seekTo(ts.value / 100000 * player.getDuration(), true);
}

// These functions toggle video settings and change textures
function toggleMute() {
	if (player.isMuted()) {
		player.unMute();
		document.getElementById('toggleMuteButton').src = 'icons/loud.svg';
	} else {
		player.mute();
		document.getElementById('toggleMuteButton').src = 'icons/mute.svg';
	}
}

function togglePlay() {
	if (player.getPlayerState() === 1) {
		player.pauseVideo();
		document.getElementById('playPauseButton').src = 'icons/play.svg';
	} else if (player.getPlayerState() === 2) {
		player.playVideo();
		document.getElementById('playPauseButton').src = 'icons/pause.svg';
	}
}

// This function manages hotkeys

document.onkeydown = function (e) {
	e = e || window.event;

	if (!$('#search').is(':focus')) {
		if (e.keyCode === 32 || e.keyCode === 75) { // 'SPACE' (pause)
			togglePlay();
			return false;
		}
		if (e.keyCode === 37 || e.keyCode === 74) { // 'LEFT' (rewind)
			rewind();
		}
		if (e.keyCode === 39 || e.keyCode === 76) { // 'RIGHT' (forward)
			fastForward();
		}
		if (e.keyCode === 38) { // 'UP' (volume up)
			volumeUp();
		}
		if (e.keyCode === 40) { // 'DOWN' (volume down)
			volumeDown();
		}
		if (e.keyCode === 77) { // 'M' (mute)
			toggleMute();
		}
	}
};

// This function takes a video search query as input
// and changes the video to the first YouTube result
function searchVideo(query) {
	player.pauseVideo();
	progressBar(0, 0, 0);

	document.getElementById('playPauseButton').src = 'icons/play.svg';

	loadSong(query);

	console.log(query);

	searchTrack(query).then(data => {
		player.loadPlaylist({
			listType: 'search',
			list: data.results.trackmatches.track[0].name + ' - ' + data.results.trackmatches.track[0].artist,
			index: 0
		});
	}).catch(err => {
		if (err === 'No query') {
			console.log('No query, this is fine.')
		}
	})
}

function clearHistory() {
	localStorage.removeItem('history');
	document.getElementById('history').innerHTML = '';
}

async function imgsrcToB64(img) {
	return new Promise((resolve, reject) => {
		blobUtil.imgSrcToDataURL(img, 'image/png', 'Anonymous', 1.0).then(blob => {
			resolve(blob);
		}).catch(err => {
			console.log(err); // Error
		});
	});
}

function toggleVideo() {
	if (document.getElementById('player').style.visibility === 'hidden' && (player.getPlayerState() === 1 || player.getPlayerState() === 2)) {
		document.getElementById('youtubeactive').style.pointerEvents = 'none';
		document.getElementById('youtube').style.pointerEvents = 'none';
		document.getElementById('player').style.visibility = 'visible';
		document.getElementById('youtubeactive').style.visibility = 'visible';
		$('#player').fadeIn('fast', () => {
			document.getElementById('clickShield').style.visibility = 'visible';
		});
		$('#youtubeactive').fadeIn('fast', () => {
			document.getElementById('youtube').style.visibility = 'hidden';
			document.getElementById('youtubeactive').style.pointerEvents = 'all';
			document.getElementById('youtube').style.pointerEvents = 'all';
		});
	} else if (player.getPlayerState() >= 0) {
		document.getElementById('youtubeactive').style.pointerEvents = 'none';
		document.getElementById('youtube').style.pointerEvents = 'none';
		document.getElementById('clickShield').style.visibility = 'hidden';
		$('#player').fadeOut('fast', () => {
			document.getElementById('player').style.visibility = 'hidden';

			$('#youtubeactive').fadeOut('fast', () => {
				document.getElementById('youtubeactive').style.visibility = 'hidden';
				document.getElementById('youtubeactive').style.pointerEvents = 'all';
				document.getElementById('youtube').style.pointerEvents = 'all';
			});
			document.getElementById('youtube').style.visibility = 'visible';
		});
	}
}
