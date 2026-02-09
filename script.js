const folderId = "13XwzkYwGyHy-e4XJHQqruEYQNbeVMkAz"; // ganti Folder ID kamu
const apiKey = "AIzaSyBoBNByeXsZIgIQDNTsEBpVhjEKlUHGhns";
const clientName = "NAMA_CLIENT";

const gallery = document.getElementById("gallery");
let selectedPhotos = [];

fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,name)&key=${apiKey}`)
.then(res => res.json())
.then(data => {
  data.files.forEach(file => {
    const img = document.createElement("img");
    img.src = `https://drive.google.com/uc?id=${file.id}`; // full-res image
    img.alt = file.name;

    img.addEventListener("click", () => {
      if (selectedPhotos.includes(file.id)) {
        selectedPhotos = selectedPhotos.filter(id => id !== file.id);
        img.style.border = "";
      } else {
        selectedPhotos.push(file.id);
        img.style.border = "3px solid green";
      }

      document.getElementById("selected").innerText = `${selectedPhotos.length} Foto Terpilih`;

      // Kirim pilihan ke Firebase
      fetch(`https://https://selectorapp-b96d9-default-rtdb.firebaseio.com/clients/${clientName}.json`, {
        method: "PUT",
        body: JSON.stringify({ selectedPhotos })
      });
    });

    gallery.appendChild(img);
  });
});

