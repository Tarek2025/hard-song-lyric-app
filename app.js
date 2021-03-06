const songOutput = document.getElementById('findSong');
const songOutputBtn = document.getElementById('songBtn');
const listSuggestion = document.getElementById("suggestion");
const lyricsOutput = document.getElementById("findLyrics");
songOutput.addEventListener("keypress", event => {
    if (songOutput.value.length > 0) {
        songOutput.style.color = "black";
    }
    const api = `https://api.lyrics.ovh/suggest/${event.target.value+event.key}`;
    fetch(api)
        .then(res => res.json())
        .then(data => {
            for (let i = 1; i <= 10; i++) {
                document.getElementById("title" + i).innerText = data.data[i].title;
                document.getElementById("artist" + i).innerText = data.data[i].artist.name;
                const title = data.data[i].title;
                const artist = data.data[i].artist.name;
                document.getElementById("lyricsBtn" + i).addEventListener("click", (event) => {
                    const secondApi = `https://api.lyrics.ovh/v1/${artist}/${title}`;
                    fetch(secondApi)
                        .then(res => res.json())
                        .then(data => {
                            let str = data.lyrics.split(" ");
                            let [a, b, c] = str;
                            if (str.length > 10) {
                                document.getElementById("lyricsContentTitle").innerText = `${a} ${b} ${c}`;
                            } else {
                                document.getElementById("lyricsContentTitle").innerText = `${a}`;
                            }
                            document.getElementById("textContent").innerText = data.lyrics;
                        })
                    document.getElementById("lyricsContent").style.display = "block";
                })
            }
            listSuggestion.style.display = "block";
        })
})
songOutputBtn.addEventListener('click', event => {
    if (songOutput.value.length < 1) {
        let songOutput = document.getElementById("songOutput");
        songOutput.value = "type a lyrics name";
        songOutput.style.color = "red";
        document.getElementById("lyricsOutput").style.display = "none";
    } else {
        songOutput.style.color = "black";
        const api = `https://api.lyrics.ovh/suggest/${songOutput.value}`;
        document.getElementById("lyricsContent").style.display = "none";
        for (let i = 1; i <= 15; i++) {
            document.getElementById("textContent" + i).style.display = "none";
        }
        fetch(api)
            .then(res => res.json())
            .then(data => {
                if (data.data.length == 0) {
                    document.getElementById("alertUnavailable").innerHTML = `<h4 style="color:red; text-align:center">We are so sorry that <br>
            this lyrics is not available, now</h4>`
                } else {
                    for (let i = 1; i <= data.data.length; i++) {
                        document.getElementById("lyricsTitle" + i).innerHTML = data.data[i].title;
                        document.getElementById("lyricsArtist" + i).innerHTML = data.data[i].artist.name;
                        lyricsOutput.style.display = "block";
                        let count = 1;
                        document.getElementById("getLyricsBtn" + i).addEventListener("click", event => {
                            let textContent = document.getElementById("textContent" + i);
                            let title = data.data[i].title;
                            let artist = data.data[i].artist.name;
                            let secondApi = `https://api.lyrics.ovh/v1/${artist}/${title}`;
                            fetch(secondApi)
                                .then(res => res.json())
                                .then(data => {
                                    // console.log(data.lyrics)
                                    if (data.lyrics == undefined) {
                                        textContent.innerHTML = `<p style="color:red; text-align:center;">At this time, this lyrics is not available , Please try again later</p>`
                                        textContent.style.display = "block"

                                    } else {
                                        if (count % 2 !== 0) {
                                            textContent.innerHTML = data.lyrics
                                            textContent.style.display = "block"
                                            count++
                                        } else {
                                            textContent.style.display = "none"
                                            count++
                                        }
                                    }
                                })
                        })

                    }
                }
            })
    }
})