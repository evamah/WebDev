const tbody = document.querySelector("#songsTable tbody");

const songId = document.getElementById("songId");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const year = document.getElementById("year");
const file = document.getElementById("file");

const songForm = document.getElementById("songForm");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const searchBtn = document.getElementById("searchBtn");
const sArtist = document.getElementById("searchArtist");
const sMin = document.getElementById("searchMinYear");
const sMax = document.getElementById("searchMaxYear");

let editMode = false;

// -------- LOAD SONGS --------
async function loadSongs() {
    const res = await fetch("/api/songs");
    render(await res.json());
}

function render(songs) {
    tbody.innerHTML = "";
    songs.forEach(s => {
        tbody.innerHTML += `
    <tr>
      <td>${s.id}</td>
      <td>${s.title}</td>
      <td>${s.artist}</td>
      <td>${s.year}</td>
      <td>${s.mp3 ? `<audio controls src="${s.mp3}"></audio>` : "no file"}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editSong(${s.id})">Edit</button>
        <button class="btn btn-danger btn-sm"  onclick="deleteSong(${s.id})">Del</button>
      </td>
    </tr>`;
    });
}

// -------- CREATE / UPDATE --------
songForm.addEventListener("submit", async e => {
    e.preventDefault();

    if (!editMode) {
        // CREATE with file
        const fd = new FormData();
        fd.append("title", title.value);
        fd.append("artist", artist.value);
        fd.append("year", year.value);

        if (file.files[0])
            fd.append("file", file.files[0]);

        await fetch("/api/songs", { method: "POST", body: fd });
    }
    else {
        // UPDATE metadata only
        const data = {
            title: title.value,
            artist: artist.value,
            year: year.value
        };

        await fetch(`/api/songs/${songId.value}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    }

    clearForm();
    loadSongs();
});

function clearForm() {
    editMode = false;
    songId.value = "";
    title.value = "";
    artist.value = "";
    year.value = "";
    file.value = "";
}

cancelEditBtn.onclick = clearForm;

// -------- EDIT --------
async function editSong(id) {
    const res = await fetch(`/api/songs/${id}`);
    const s = await res.json();

    editMode = true;

    songId.value = s.id;
    title.value = s.title;
    artist.value = s.artist;
    year.value = s.year;
    file.value = "";
}

// -------- DELETE --------
async function deleteSong(id) {
    if (!confirm("Delete this song?")) return;

    await fetch(`/api/songs/${id}`, { method: "DELETE" });
    loadSongs();
}

// -------- SEARCH (Querystring) --------
searchBtn.onclick = async () => {
    const params = new URLSearchParams();

    //
    if (sArtist.value) params.append("artist", sArtist.value);
    if (sMin.value) params.append("minYear", sMin.value);
    if (sMax.value) params.append("maxYear", sMax.value);

    const url = "/api/search?" + params.toString();
    console.log("Query URL:", url);

    const res = await fetch(url);
    render(await res.json());
};

// -------- INIT --------
loadSongs();
