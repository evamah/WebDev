const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// static Folder is client folder
app.use(express.static(path.join(__dirname, "client")));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

