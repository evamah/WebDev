//--Get HTML DOM Element References
const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');
const sortBtn = document.getElementById('sort');
let viewBtn = document.getElementById('viewToggle');

//--view mode 
let viewMode = "table"; //or "cards"


//--if not exist in localStorage get empty array 
//-- else get json text and convert it to object json
let songs = JSON.parse(localStorage.getItem('songs')) || [];


//--render songs on page load 
renderSongs();


//-------------------------------------------------------------------------------------------

//--user click the +add button  
form.addEventListener('submit', async (e) => {
    //--dont submit the form to the server yet let me handle it here
    e.preventDefault();

    //--read form data
    let title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const id = document.getElementById('songId').value;
    const rating = document.getElementById('rating').value;


    const videoId = getYouTubeID(url);
    if (!videoId) {
        alert("Please enter a valid YouTube URL");
        return;
    }


    // Only fetch if we are Adding (no ID) AND the user didn't type a title
    if (!id && !title) {
        // UX: Show the user we are working
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching...';

        // PAUSE HERE while we talk to Google
        const apiTitle = await fetchVideoTitle(videoId);

        // Get Thumbnail URL
        const Thumbnail = getThumbnail(videoId);

        // If API works, use that title. If not, use a fallback.
        title = apiTitle || "Unknown Video";

        // UX: Reset button
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
    }

    // Fallback if title is still empty
    if (!title) title = "Untitled Track";

    //--reset the form
    form.reset();

    //--TODO: VALIDATE FIELDS
    if (id) {
        //--update existing song
        const index = songs.findIndex(s => s.id == id);
        songs[index].title = title;
        songs[index].url = url;
        songs[index].rating = rating;
        songs[index].apiTitle = await fetchVideoTitle(videoId);
        songs[index].thumbnail = getThumbnail(videoId);

        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
        submitBtn.classList.replace('btn-warning', 'btn-success');


    } else {
        //--add new song
        const song = {
            id: Date.now(),
            title: title,
            url: url,
            rating: rating,
            apiTitle: await fetchVideoTitle(videoId),
            thumbnail: getThumbnail(videoId),
            dateAdded: Date.now()
        };
        songs.push(song);
    }


    //TO DO SAVE AND RERENDER
    SaveAndRender();
    sortSongs(sortBtn.value); // apply sorting after adding

    form.reset();
});


//--save to Local Storage and render UI Table
function SaveAndRender() {

    localStorage.setItem('songs', JSON.stringify(songs));

    //TODO RENDER UI TABLE
    renderSongs();
}


function renderSongs() {
    list.innerHTML = ''; // Clear current list

    if (viewMode === "table") {
        list.className = "";

        songs.forEach(song => {
            const videoId = getYouTubeID(song.url);

            // Create table row
            const row = document.createElement('tr');

            row.innerHTML = `
            <td>${song.title}</td>
            <td><img src="${song.thumbnail}" width="80" class="me-2 rounded"></td>
            <td>${song.apiTitle || "Unknown"}</td>
            <td class="align-middle"> <button class="btn btn-sm btn-outline-info" onclick="playVideo('${videoId}')"> <i class="fas fa-play"></i> Watch </button> </td>
            <td>${song.rating}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
            list.appendChild(row);
        });
    }
    else {  // viewMode === "cards"
        list.className = "d-flex flex-wrap gap-3";

        songs.forEach(song => {
            const card = document.createElement('div');
            card.className = "card p-3";
            card.style.width = "18rem";

            card.innerHTML = `
                <img src="${song.thumbnail}">
                <div class="card-body">
                    <h5 class="card-title">${song.title}</h5>
                    <p class="card-text">Rating: ${song.rating}</p>
                    <a href="${song.url}" class="btn btn-primary mb-2" target="_blank">Watch</a>
                    <button class="btn btn-warning w-100" onclick="editSong(${song.id})">Edit</button>
                    <button class="btn btn-danger w-100 mt-2" onclick="deleteSong(${song.id})">Delete</button>
                </div>
            `;

            list.appendChild(card);
        });

    }
}


function getYouTubeID(url) {
    const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

const API_KEY = 'YOUR_GOOGLE_API_KEY_HERE';

async function fetchVideoTitle(videoId) {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

    try {
        // 2. Ask Google (Wait for reply)
        const response = await fetch(url);
        const data = await response.json();

        // 4. Return the Title
        return data.title;
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
}

// Thumbnail
function getThumbnail(videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}


//--user click the watch link in the table
function playVideo(videoId) {
    if (!videoId) {
        alert("Invalid YouTube URL");
        return;
    }

    const frame = document.getElementById('videoFrame');
    const modalElement = document.getElementById('videoModal');
    const videoInfo = document.getElementById('videoInfo');

    const song = songs.find(s => getYouTubeID(s.url) === videoId);

    if (!song) {
        alert("Song not found");
        return;
    }

    videoInfo.innerHTML = `
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Thumbnail</th>
                    <th>Song Name</th>
                    <th>Rating</th>
                </tr>
            </thead>
            </thead>
            <tbody>
                <tr>
                    <td>${song.title}</td>
                    <td><img src="${song.thumbnail}" width="80" class="me-2 rounded"></td>
                    <td>${song.apiTitle || "Unknown"}</td>
                    <td>${song.rating}</td>
                </tr>
            </tbody>
        </table>
    `;


    // Set the source to the YouTube Embed URL (autoplay=1 makes it start immediately)
    frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

    // Initialize and Show Bootstrap Modal
    // (We use 'window.bootstrap' because we loaded the CDN)
    const myModal = new bootstrap.Modal(modalElement);
    myModal.show();
}


//-------------------------------------------------------------------------------------------


//--user click the sort button
sortBtn.addEventListener("change", () => {
    let val = sortBtn.value;
    if (val === "newest") {
        songs.sort((a, b) => b.dateAdded - a.dateAdded);
    }
    else if (val === "az") {
        songs.sort((a, b) => a.title.localeCompare(b.title));
    }
    else if (val === "number") {
        songs.sort((a, b) => b.rating - a.rating);
    }

    SaveAndRender()
});

//-------------------------------------------------------------------------------------------

//--user click the view toggle button
viewBtn.addEventListener("click", () => {
    viewMode = viewMode === "table" ? "cards" : "table";

    // Hide/Show table headers
    document.querySelectorAll("th").forEach(th => {
        th.style.display = (viewMode === "cards") ? "none" : "";
    });

    updateToggleIcon();
    renderSongs();
});
function updateToggleIcon() {
    const icon = document.getElementById("toggleIcon");

    if (viewMode === "table") {
        icon.className = "fas fa-table";
    } else {
        icon.className = "fas fa-th-large";
    }
}

//-------------------------------------------------------------------------------------------

//--updated function, so when the song is updated it dosent send the delete alarm
function deleteSong(id, alarm = true) {
    if (alarm) {
        if (confirm('Are you sure?')) {
            //-- find the song with the matching Id
            songs = songs.filter(song => song.id !== id);
            SaveAndRender();
        }
    }
    else {
        //-- find the song with the matching Id
        songs = songs.filter(song => song.id !== id);
        SaveAndRender();
    }

}

//-------------------------------------------------------------------------------------------


function editSong(id) {

    //-- find the song with the matching Id
    const songToEdit = songs.find(song => song.id == id);

    document.getElementById('title').value = songToEdit.title;
    document.getElementById('url').value = songToEdit.url;
    document.getElementById('songId').value = songToEdit.id;
    document.getElementById('rating').value = songToEdit.rating;

    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update';
    submitBtn.classList.replace('btn-success', 'btn-warning');
}

//-------------------------------------------------------------------------------------------

//--user closes the modal
// We listen for the Bootstrap specific event 'hidden.bs.modal'
const videoModal = document.getElementById('videoModal');
videoModal.addEventListener('hidden.bs.modal', () => {
    const frame = document.getElementById('videoFrame');
    frame.src = ''; // Wipes the source, stopping the audio
});









