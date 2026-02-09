const folderId = "13XwzkYwGyHy-e4XJHQqruEYQNbeVMkAz"; // Ganti dengan folder ID Drive client
const apiKey = "AIzaSyBoBNByeXsZIgIQDNTsEBpVhjEKlUHGhns"; // Ganti API Key Google Drive
const clientName = "NAMA_CLIENT"; // Bisa dinamis dari URL atau input

const gallery = document.getElementById("gallery");
const selectedP = document.getElementById("selected");
let selectedPhotos = [];

// Ambil file dari Drive
fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,name)&key=${apiKey}`)
.then(res=>res.json())
.then(data=>{
  data.files.forEach(file=>{
    const img = document.createElement("img");
    img.src = `https://drive.google.com/uc?id=${file.id}`;
    img.alt = file.name;

    img.addEventListener("click",()=>{
      if(selectedPhotos.includes(file.id)){
        selectedPhotos = selectedPhotos.filter(id=>id!==file.id);
        img.style.border = "";
      }else{
        selectedPhotos.push(file.id);
        img.style.border = "3px solid green";
      }
      selectedP.innerText = `${selectedPhotos.length} Foto Terpilih`;

      // Kirim pilihan ke Firebase
      fetch(`https://photoselectorapp-default-rtdb.firebaseio.com/clients/${clientName}.json`,{
        method:"PUT",
        body: JSON.stringify({selectedPhotos})
      });
    });

    gallery.appendChild(img);
  });
});
