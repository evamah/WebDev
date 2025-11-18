//-- Page to navigate when clicked menu item 
// page: from HTMl CliCk 
function loadPage(page) {

    //Get reference fro the HTML element by its id 
    // contentFrame is iframe element type
    let iframe = document.getElementById("contentFrame");

    // Give the iframe the HTML address
    iframe.src = page;

    // Close sidebar on mobile
    document.getElementById("sidebar").classList.remove("show");
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("show");
}