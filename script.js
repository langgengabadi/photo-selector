const API_KEY = "AIzaSyBoBNByeXsZIgIQDNTsEBpVhjEKlUHGhns"; // API Key Google Drive
const folderId = "13XwzkYwGyHy-e4XJHQqruEYQNbeVMkAz"; // Folder ID Drive kamu

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const close = document.getElementById("close");

// Ambil file dari Drive
fetch(
  `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,name)&key=${API_KEY}`
)
.then(res => res.json())
.then(data => {
  data.files.forEach(file => {
    const img = document.createElement("img");
    // FULL RESO sebagai src untuk kualitas bagus
    img.dataset.src = `https://drive.google.com/uc?id=${file.id}`;
    img.alt = file.name;
    img.className = "lazy";
    gallery.appendChild(img);
  });

  // Mulai lazy load
  lazyLoadImages();
});

// Lazy load function
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll("img.lazy");
  const config = {
    rootMargin: "50px 0px",
    threshold: 0.01
  };

  let observer = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        self.unobserve(img);
      }
    });
  }, config);

  lazyImages.forEach(img => observer.observe(img));
}

// Lightbox
gallery.addEventListener("click", e => {
  if(e.target.tagName === "IMG") {
    lightbox.style.display = "flex";
    lightboxImg.src = e.target.src;
  }
});

close.addEventListener("click", () => {
  lightbox.style.display = "none";
});

lightbox.addEventListener("click", e => {
  if(e.target === lightbox) {
    lightbox.style.display = "none";
  }
});
