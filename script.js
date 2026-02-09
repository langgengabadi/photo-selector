const API_KEY = "AIzaSyBoBNByeXsZIgIQDNTsEBpVhjEKlUHGhns";

const params = new URLSearchParams(window.location.search);
const folderId = params.get("folder");
const limit = parseInt(params.get("limit")) || 9999;
const client = params.get("client") || "default";

const storageKey = `selected_${client}_${folderId}`;
let selected = JSON.parse(localStorage.getItem(storageKey)) || [];

const gallery = document.getElementById("gallery");
const info = document.getElementById("info");

info.innerText = `Dipilih: ${selected.length} / ${limit}`;

fetch(
  `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,name,thumbnailLink)&key=${API_KEY}`
)
  .then(res => res.json())
  .then(data => {
    data.files.forEach(file => {
      const wrap = document.createElement("div");
      wrap.className = "photo-wrap";

      if (selected.includes(file.id)) {
        wrap.classList.add("selected");
      }

      const img = document.createElement("img");
      img.src = file.thumbnailLink;

      const label = document.createElement("div");
      label.className = "select-label";
      label.innerText = selected.includes(file.id) ? "DIPILIH" : "PILIH";

      img.onclick = () => {
        if (selected.includes(file.id)) {
          selected = selected.filter(id => id !== file.id);
          wrap.classList.remove("selected");
          label.innerText = "PILIH";
        } else {
          if (selected.length >= limit) {
            alert("Batas pilihan tercapai");
            return;
          }
          selected.push(file.id);
          wrap.classList.add("selected");
          label.innerText = "DIPILIH";
        }

        localStorage.setItem(storageKey, JSON.stringify(selected));
        info.innerText = `Dipilih: ${selected.length} / ${limit}`;
      };

      wrap.appendChild(img);
      wrap.appendChild(label);
      gallery.appendChild(wrap);
    });
  });

document.getElementById("finishBtn").onclick = () => {
  if (selected.length === 0) {
    alert("Belum ada foto dipilih");
    return;
  }

  let result = "FOTO TERPILIH (FULL RESO):\n\n";
  selected.forEach(id => {
    result += `https://drive.google.com/uc?id=${id}&export=download\n`;
  });

  const blob = new Blob([result], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `hasil_pilihan_${client}.txt`;
  a.click();
};
