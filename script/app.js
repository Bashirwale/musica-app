let currentMusic = 0;
let randomSongs;

//NAVIGATION MENU BUTTON
const openMenu = document.querySelector(".open-menu");
const closeMenu = document.querySelector(".close-menu");
const navMenu = document.querySelector(".navigation-menu");
const userDetails = document.querySelector(".users-details");

//MUSIC PLAYER
const music = document.querySelector("#music");
const seekBar = document.querySelector(".seek-bar");
const volumeSlider = document.querySelector(".volume-slider");
const songName = document.querySelector(".song-name");
const artistName = document.querySelector(".artist-name");
const songCover = document.querySelector(".current-song-img");

//TOP CHART
const topChartSongs = document.querySelector(".hero-chart--cards");
const chartSong = document.querySelector(".hero-artist-name");
const chartArtist = document.querySelector(".hero-chart-sub-header");
const chartduration = document.querySelector(".hero-song-duration");

//MUSIC PLAYER CONTROLS
const playBtn = document.querySelector(".play-btn");
const nextBtn = document.querySelector(".next-btn");
const previousBtn = document.querySelector(".pre-btn");
const shuffleBtn = document.querySelector(".shuffle-btn");
const repeatBtn = document.querySelector(".repeat-btn");

//mobile menu navigation
openMenu.addEventListener("click", () => {
  navMenu.style.display = "flex";
  userDetails.style.display = "flex";
});
closeMenu.addEventListener("click", () => {
  navMenu.style.display = "none";
  userDetails.style.display = "none";
});

//HTTP REQUEST TO LOCAL SERVER
let songDatabase = new XMLHttpRequest();
songDatabase.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    let response = JSON.parse(songDatabase.responseText);

    //top chart
    let topChart = ``;
    for (let i = 0; i < response.songs.length - 3; i++) {
      chartIndex = response.songs[i];
      topChart = ` <a href="top-chart.html" class="hero-chart-card">
      <div class="hero-card-content">
        <img src="${
          chartIndex.cover
        }" class="hero-chart-image" alt="heart icon" />
        <div class="hero-chart-text">
          <h3 class="hero-chart-sub-header">${chartIndex.name}</h3>
          <p class="hero-artist-name">${chartIndex.artist}</p>
          <p class="hero-song-duration">${Math.floor(
            chartIndex.duration / 60
          )}:11</p>
        </div>
      </div>
      <div class="hero-heart">
        <img src="images/icons/heart.png" alt="heart icon" />
      </div>
    </a>`;
      topChartSongs.innerHTML += topChart;
    }
    //setup music
    const setMusic = (i) => {
      seekBar.value = 0; // set range slide value to 0;
      let song = response.songs[i];
      currentMusic = i;
      music.src = song.path;
      songName.innerHTML = song.name;
      artistName.innerHTML = song.artist;
      songCover.style.backgroundImage = `url('${song.cover}')`;

      setTimeout(() => {
        seekBar.max = music.duration;
      }, 300);
    };
    setMusic(0);
    //TOP CHART

    //SHUFFLE BTN
    const shuffleSongs = () => {
      if (shuffleBtn.className.includes("toggle-shuffle")) {
        removeShuffle();
      } else {
        addShuffle();
      }
    };
    shuffleBtn.addEventListener("click", () => {
      shuffleSongs();
    });

    //PLAY BUTTON
    playBtn.addEventListener("click", () => {
      if (playBtn.className.includes("pause")) {
        music.pause();
      } else {
        music.play();
      }

      playBtn.classList.toggle("pause");
      songCover.classList.toggle("play");
    });

    // seek bar
    setInterval(() => {
      seekBar.value = music.currentTime;
    }, 500);

    //volume and seek
    volumeSlider.addEventListener("change", () => {
      music.volume = volumeSlider.value / 100;
    });
    seekBar.addEventListener("change", () => {
      music.currentTime = seekBar.value;
    });

    // forward and backward button
    nextBtn.addEventListener("click", () => {
      if (
        currentMusic === randomSongs &&
        shuffleBtn.className.includes("toggle-shuffle")
      ) {
        addShuffle();
      } else {
        if (currentMusic >= response.songs.length - 1) {
          currentMusic = 0;
        } else {
          currentMusic++;
        }
        setMusic(currentMusic);
        playMusic();
      }
    });

    previousBtn.addEventListener("click", () => {
      if (currentMusic <= 0) {
        currentMusic = response.songs.length - 1;
      } else {
        currentMusic--;
      }
      setMusic(currentMusic);
      playMusic();
    });

    //REPEAT BUTTON
    repeatBtn.addEventListener("click", () => {
      if (!repeatBtn.className.includes("toggle-repeat")) {
        repeatBtn.classList.add("toggle-repeat");
        music.loop = true;
      } else {
        repeatBtn.classList.remove("toggle-repeat");
        music.loop = false;
      }
    });

    //PASUES AND PLAYS THE SONG
    const playMusic = () => {
      music.play();
      playBtn.classList.add("pause");
      songCover.classList.add("play");
    };

    //ADDS AND REMOVE SHUFFLE
    const addShuffle = () => {
      randomSongs = Math.floor(Math.random() * response.songs.length);
      currentMusic = randomSongs;
      console.log(randomSongs);
      shuffleBtn.classList.add("toggle-shuffle");
      setMusic(currentMusic);
      playMusic();
    };
    const removeShuffle = () => {
      setMusic(currentMusic);
      shuffleBtn.classList.remove("toggle-shuffle");
    };

    setInterval(() => {
      seekBar.value = music.currentTime;
      if (Math.floor(music.currentTime) == Math.floor(seekBar.max)) {
        nextBtn.click();
      }
    }, 500);
  }
};
songDatabase.open("GET", "script/songs.json", true);
songDatabase.send();
