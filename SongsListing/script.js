//--Get HTML DOM Element References
const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');

//--if not exist in localStorage get empty array 
//-- else get json text and convert it to object json
let songs = JSON.parse(localStorage.getItem('songs')) || [];


//--user click the +add button  
form.addEventListener('submit', (e) => {
    //--dont submit the form to the server yet let me handle it here
    e.preventDefault();

    //--read form data
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;

    //--TODO: VALIDATE FIELDS

    //--create JSON object based on URL title
    const song = {
        id: Date.now(),  // Unique ID
        title: title,
        url: url,
        dateAdded: Date.now()
    };


    songs.push(song);

    //TO DO SAVE AND RERENDER 
    SaveAndRender();

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

    songs.forEach(song => {
        // Create table row
        const row = document.createElement('tr');
        //
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
        SaveAndRender();
    }
}


form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const id = document.getElementById('songId').value; // Check hidden ID

    if (id) {
        // --- UPDATE MODE ---
        const index = songs.findIndex(s => s.id == id);
        songs[index].title = title;
        songs[index].url = url;

        // Reset Button
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
        submitBtn.classList.replace('btn-warning', 'btn-success');
        document.getElementById('songId').value = '';
    } else {
        // --- ADD MODE ---
        const song = {
            id: Date.now(),
            title: title,
            url: url,
            dateAdded: Date.now()
        };
        songs.push(song);
    }

    saveAndRender();
    form.reset();
});