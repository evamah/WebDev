const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');

// if not exists in localStorage get empty array
// else get json tet and convert it to object json
let songs = JSON.parse(localStorage.getItem('playlist')) || [];

saveAndRender();

// user click the "+ Aaa" button 
form.addEventListener('submit', (e) => {
    // dont submit the form to server yet let me handle it here
    e.preventDefault();

    // read forms data
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;

    // create JSON object based on URL title
    const song = {
        id: Date.now(),  // Unique ID
        title: title,
        url: url,
        dateAdded: Date.now()
    };


    songs.push(song);

    //TO DO SAVE  AND RERENDER 
    saveAndRender();
    form.reset();
});


function saveAndRender() {

    localStorage.setItem('playlist', JSON.stringify(songs));

    // TODO  RELODE IT
    renderSongs(songs);

}


function renderSongs(songArray) {
    list.innerHTML = ''; // Clear current list

    songArray.forEach(song => {
        // Create table row
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${song.title}</td>
            <td><a href="${song.url}" target="_blank" class="text-info">Watch</a></td>
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


function deleteSong(id) {
    if (confirm('Are you sure?')) {
        // Filter out the song with the matching ID
        songs = songs.filter(song => song.id !== id);
        saveAndRender();
    }
}





