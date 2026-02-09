const params = new URLSearchParams(window.location.search);
const folderId = params.get("folder");
const limit = parseInt(params.get("limit")) || 10;
const client = params.get("client") || "default";

const API_KEY = "AIzaSyBoBNByeXsZIgIQDNTsEBpVhjEKlUHGhns";
const gallery = document.getElementById("gallery");

const selectedKey = "selected_" + client;
let selected = JSON.parse(localStorage.getItem(selectedKey)) || [];

// LIGHTBOX ELEMENT
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxSelect = document.getElementById("lightboxSelect");
const closeBtn = document.getElementById("closeLightbox");

let currentPhotoId = null;

// LOAD FOTO
fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${API_KEY}&fields=files(id,name,thumbnailLink)`)
  .then(res => res.json())
  .then(data => {
    data.files.forEach(file => {
      const img = document.createElement("img");
      img.src = file.thumbnailLink.replace("=s220", "=s600");
      img.className = "photo";

      img.onclick = () => openLightbox(file.id);

      gallery.appendChild(img);
    });
  });

// BUKA LIGHTBOX
function openLightbox(fileId) {
  currentPhotoId = fileId;
  lightboxImg.src = `https://drive.google.com/uc?id=${fileId}`;
  updateButton();
  lightbox.style.display = "flex";
}

// UPDATE TOMBOL
function updateButton() {
  if (selected.includes(currentPhotoId)) {
    lightboxSelect.textContent = "BATAL PILIH";
    lightboxSelect.style.background = "#e74c3c";
  } else {
    lightboxSelect.textContent = "PILIH";
    lightboxSelect.style.background = "#2ecc71";
  }
}

// KLIK PILIH
lightboxSelect.onclick = () => {
  if (!currentPhotoId) return;

  if (selected.includes(currentPhotoId)) {
    selected = selected.filter(id => id !== currentPhotoId);
  } else {
    if (selected.length >= limit) {
      alert("Maksimal " + limit + " foto");
      return;
    }
    selected.push(currentPhotoId);
  }

  localStorage.setItem(selectedKey, JSON.stringify(selected));
  updateButton();
};

// TUTUP
closeBtn.onclick = () => {
  lightbox.style.display = "none";
};
