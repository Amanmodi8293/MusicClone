// let's selecte all required element or tag
const wrapper = document.querySelector(".wrapper");
let musicimg = wrapper.querySelector(".image-area img");
let musicname = wrapper.querySelector(".songs-details .name");
let musicartist = wrapper.querySelector(".songs-details .artist");
let mainaudio = wrapper.querySelector("#main-audio");
let playpauseBtn = wrapper.querySelector(".play-pause");
let prevBtn = wrapper.querySelector("#prev");
let nextBtn = wrapper.querySelector("#next");
let progressBar = wrapper.querySelector(".progress-bar");
let progressArea = wrapper.querySelector(".progress-area");
let musicList = wrapper.querySelector(".music-list");
let showmoreBtn = wrapper.querySelector("#more_music");
let hidemusicBtn = wrapper.querySelector("#close");

function openfullscreen() {
    if (fullscreen.requestFullscreen) {
        fullscreen.requestFullscreen();
    }
}
// load random music on page refresh
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", () => {
    loadmusic(musicIndex);// calling loadmusic function once window loaded
    playingNow();
})
// load music function
function loadmusic(indexNumb) {
    musicname.innerText = allMusic[indexNumb - 1].name;
    musicartist.innerText = allMusic[indexNumb - 1].artist;
    musicimg.src = `images/${allMusic[indexNumb - 1].image}`;
    mainaudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}
// play music function
function playmusic() {
    wrapper.classList.add("paused");
    playpauseBtn.querySelector("i").innerText = "pause";
    mainaudio.play();
}
// pause music function
function pausemusic() {
    wrapper.classList.remove("paused");
    playpauseBtn.querySelector("i").innerText = "play_arrow";
    mainaudio.pause();
}
// prev music function
function prevMusic() {
    // here we will just decrement of index by 1
    musicIndex--;
    // if music index is lessthan 1 then music index will be array length so the last song will play
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadmusic(musicIndex);// calling loadmusic function once window loaded
    mainaudio.play();
    playingNow();

}
// next music function
function nextMusic() {
    // here we will just increment of index by 1
    musicIndex++;
    // if music index is greaterthan array length then music index will  be 1 so the first song will play
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadmusic(musicIndex);// calling loadmusic function once window loaded
    mainaudio.play();
    playingNow();

}


// play or music button event
playpauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    // if isMusicPaused is true then call pausemusic else call playmusic
    isMusicPaused ? pausemusic() : playmusic();
    playingNow();
});
// prev music button event
prevBtn.addEventListener("click", () => {
    prevMusic();// calling netx music function
});
// next music button event
nextBtn.addEventListener("click", () => {
    nextMusic();// calling netx music function
});

// update progressbar width according to music current time
mainaudio.addEventListener('timeupdate', (e) => {
    const currentTime = e.target.currentTime;// getting current time of song
    const duration = e.target.duration;// getting total duration of song
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current");
    let musicDuration = wrapper.querySelector(".duration");

    mainaudio.addEventListener("loadeddata", () => {
        // Update song total duration
        let audioDuration = mainaudio.duration;
        let totalmin = Math.floor(audioDuration / 60);
        let totalsec = Math.floor(audioDuration % 60);
        if (totalsec < 10) {  // adding 0 if totalsec is lessthan 10
            totalsec = `0${totalsec}`
        }
        musicDuration.innerText = `${totalmin}:${totalsec}`;
    });

    // Update playing song current time
    let currentmin = Math.floor(currentTime / 60);
    let currentsec = Math.floor(currentTime % 60);
    if (currentsec < 10) {  // adding 0 if totalsec is lessthan 10
        currentsec = `0${currentsec}`
    }
    musicCurrentTime.innerText = `${currentmin}:${currentsec}`;

});
// let's update playing song current time on according to the progress bar width
progressArea.addEventListener("click", (e) => {
    let progressWidthval = progressArea.clientWidth; // getting width of progress bar
    let clickedOffSetX = e.offsetX; // getting offset x value
    let songDuration = mainaudio.duration; // getting song total duration

    mainaudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playmusic();
});
// let's work on repeat, shlffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist")
repeatBtn.addEventListener("click", () => {
    // first we get the innerText of the icon then we will the change accordingly
    let getText = repeatBtn.innerText;
    // let's do different changes of different icon click using switch
    switch (getText) {
        case "repeat":// if this icon is repeat  then change it to repeat one
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "song looped")
            break;
        case "repeat_one":// if this icon is repeat one then change it to shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "playback shuffle")
            break;
        case "shuffle":// if this icon is shuffle then change it to repeat 
            repeatBtn.setAttribute("title", "playlist looped")
            repeatBtn.innerText = "repeat";
            break;
    }
});

// above we just changed the icon, now let's work on what to do 
//  after the song ended
mainaudio.addEventListener("ended", () => {
    // we will do according to the icon means if user has set icon to loop song then will repeat
    // the current song and will do further accordingly

    let getText = repeatBtn.innerText;// getting innerText of icon

    switch (getText) {
        case "repeat":// if this icon is repeat then simply we call the next music function so the next song will play
            nextMusic();
            break;
        case "repeat_one":// if this icon is repeat one then we will change the current playing song current time to 0 so song will play from begning
            mainaudio.currentTime = 0;
            loadmusic(musicIndex);
            playmusic();
            break;
        case "shuffle":// if this icon is shuffle then change it to repeat 
            // generating random index between the max range of array length
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex);//this loop run until the next random number won't be the same of current music index
            musicIndex = randIndex; // passing randomIndex to musicIndex so the random song will play
            loadmusic(musicIndex); //calling load music function
            playmusic(); // calling play music function
    playingNow();

            break;
    }
});

showmoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

hidemusicBtn.addEventListener("click", () => {
    showmoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

// let's create li according to the array length
for(let i = 0; i < allMusic.length; i++){
    // let's pass the song name, artist from the array to li
    let liTag = ` <li li-index=${[i + 1]}>
    <div class="row">
        <span>${allMusic[i].name}</span>
        <P>${allMusic[i].artist}</P>
    </div>
    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
    <span  id="${allMusic[i].src}" class="audio-duration">00:00</span>
</li>`;

    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);


    liAudioTag.addEventListener("loadeddata", () => {
    });
        // Update song total duration
        let audioDuration = liAudioTag.duration;
        let totalmin = Math.floor(audioDuration / 60);
        let totalsec = Math.floor(audioDuration % 60 );
        if (totalsec < 10) {  // adding 0 if totalsec is lessthan 10
        totalsec = `0${totalsec}`;
    }
    liAudioDuration.innerText = `${totalmin}:${totalsec}`;
    // adding t duration attribute which we'll use below
    liAudioDuration.setAttribute("t-duration",`${totalmin}:${totalsec}`)
}
//  let's work on play particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration")
        // let's remove playing class from all other li expect the last one which is clicked 
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            // let's get that audio duration value and pass to .audio-duration innertext
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration; // passing t-duration value to audio durationText 
        }
        // if there is an li tag which li-index is equal to music index
        // then this music is playing now we'll  style now
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "playing";
        }
        // adding onclick attribute in all li tags
        allLiTags[j].setAttribute("onclick","clicked(this)");    
    }
}

// let's play song onli click
function clicked(element){
    // getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;// passing that liIndex to musicIndex
    loadmusic(musicIndex);
    playmusic();
    playingNow();
}