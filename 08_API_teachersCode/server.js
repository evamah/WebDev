
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = 3000;

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));
app.use("/mp3", express.static(path.join(__dirname, "uploads")));

// ---------------- DATA FILE ----------------
const DATA_FILE = path.join(__dirname, "data", "songs.json");

// ---------------- HELPERS ----------------
function readSongs() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    } catch (err) {
        console.log("Read JSON error:", err.message);
        return [];
    }
}

function writeSongs(songs) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(songs, null, 2));
}

// ---------------- FILE UPLOAD ----------------
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// ---------------- HOME ----------------
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "songs.html"));
});

// ---------------- API ----------------

// GET ALL
app.get("/api/songs", (req, res) => {
    res.json(readSongs());
});

// GET BY ID
app.get("/api/songs/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const song = readSongs().find(s => s.id === id);
    if (!song) return res.status(404).json({ error: "Song not found" });
    res.json(song);
});

// QUERYSTRING SEARCH DEMO
app.get("/api/search", (req, res) => {
    let songs = readSongs();
    const { artist, minYear, maxYear } = req.query;

    if (artist)
        songs = songs.filter(s => s.artist.toLowerCase().includes(artist.toLowerCase()));

    if (minYear)
        songs = songs.filter(s => s.year >= parseInt(minYear));

    if (maxYear)
        songs = songs.filter(s => s.year <= parseInt(maxYear));

    res.json(songs);
});

// CREATE + UPLOAD
app.post("/api/songs", upload.single("file"), (req, res) => {
    const songs = readSongs();
    const { title, artist, year } = req.body;

    if (!title || !artist || !year)
        return res.status(400).json({ error: "Missing fields" });

    const newSong = {
        id: songs.length ? Math.max(...songs.map(s => s.id)) + 1 : 1,
        title,
        artist,
        year: parseInt(year),
        mp3: req.file ? "/mp3/" + req.file.filename : null
    };

    songs.push(newSong);
    writeSongs(songs);

    res.status(201).json(newSong);
});

// UPDATE
app.put("/api/songs/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const songs = readSongs();
    const { title, artist, year } = req.body;

    const index = songs.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ error: "Song not found" });

    songs[index].title = title ?? songs[index].title;
    songs[index].artist = artist ?? songs[index].artist;
    songs[index].year = year ? parseInt(year) : songs[index].year;

    writeSongs(songs);
    res.json(songs[index]);
});

// DELETE
app.delete("/api/songs/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const songs = readSongs();

    const index = songs.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ error: "Song not found" });

    const deleted = songs.splice(index, 1)[0];
    writeSongs(songs);

    res.json({ deleted });
});


// ---------------- START ----------------
app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
});
