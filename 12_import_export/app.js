import { StorageManager } from "./storage.js";

const storage = new StorageManager("demo-items");

const input = document.getElementById("textInput");
const list = document.getElementById("list");

document.getElementById("addBtn").onclick = () => {
    if (!input.value) return;
    storage.add(input.value);
    input.value = "";
    render();
};

document.getElementById("exportBtn").onclick = () => {
    const data = storage.export();
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.json";
    a.click();
};

document.getElementById("importFile").onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    storage.import(JSON.parse(text));
    render();
};

function render() {
    list.innerHTML = "";
    storage.getAll().forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });
}

render();
