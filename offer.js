document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("offerForm");
  const loader = document.getElementById("loader");
  const fileInput = document.getElementById("file");

  let selectedFiles = [];


  fileInput.addEventListener("change", () => {
  const files = Array.from(fileInput.files);
  const allowedExtensions = [".stl", ".obj", ".zip"];

  files.forEach((file) => {
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      alert("✖ Sadece STL, OBJ veya ZIP dosyaları yükleyebilirsiniz!");
    } else if (file.size > 16 * 1024 * 1024) {
      alert("✖ Maksimum dosya boyutu 16MB!");
    } else {
      // Eğer aynı isimde dosya zaten varsa ekleme
      if (!selectedFiles.some((f) => f.name === file.name && f.size === file.size)) {
        selectedFiles.push(file);
      }
    }
  });

  fileInput.value = ""; // inputu sıfırla
  renderFileList();
});

  function renderFileList() {
    const fileList = document.getElementById("fileList");
    fileList.innerHTML = "";

    selectedFiles.forEach((file, index) => {
      const fileItem = document.createElement("div");
      fileItem.classList.add("file-item");
      fileItem.innerHTML = `
        <span>${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
        <button type="button" onclick="removeFile(${index})">❌</button>
      `;
      fileList.appendChild(fileItem);
    });
  }

  // Dosya sil
  window.removeFile = function (index) {
    selectedFiles.splice(index, 1);
    renderFileList();
  };

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const filament = document.querySelector("[name='filament']");
  const email = document.querySelector("[name='email']");

  // === VALIDASYONLAR ===
  if (!selectedFiles.length) {
    showToast("✖ Lütfen bir dosya seçin!", false);
    return;
  }

  if (!filament || !filament.value) {
    showToast("✖ Filament türünü seçiniz!", false);
    return;
  }

  if (!email || !email.value.includes("@")) {
    showToast("✖ Geçerli bir e-posta giriniz!", false);
    return;
  }

  // === FormData oluştur ===

  const formData = new FormData();
selectedFiles.forEach((file) => formData.append("files", file));

formData.append("firstName", document.querySelector("[name='firstName']").value);
formData.append("lastName", document.querySelector("[name='lastName']").value);
formData.append("email", document.querySelector("[name='email']").value);
formData.append("phone", document.querySelector("[name='phone']").value);
formData.append("filament", document.querySelector("[name='filament']").value);
formData.append("quantity", document.querySelector("[name='quantity']").value);
formData.append("color", document.querySelector("[name='color']").value);
formData.append("infill", document.querySelector("[name='infill']").value);
formData.append("layer", document.querySelector("[name='layer']").value);
formData.append("deliveryDate", document.querySelector("[name='deliveryDate']").value);
formData.append("details", document.querySelector("[name='details']").value);


  loader.style.display = "flex"; // loader aç

  try {
    const response = await fetch(`${window.API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Sunucu hatası: " + response.status);

    const result = await response.text();
    showToast("✔ " + result, true);

    // Formu sıfırla
    form.reset();
    selectedFiles = [];       // seçilen dosyaları temizle
    renderFileList();         // ekrandaki listeyi temizle
  } catch (err) {
    showToast("✖ Hata: " + err.message, false);
  } finally {
    loader.style.display = "none"; // loader kapat
  }
});

});

const fileInput = document.getElementById("file");
const fileList = document.getElementById("fileList");

fileInput.addEventListener("change", () => {
  fileList.innerHTML = "";

  const allowedExtensions = [".stl", ".obj", ".zip"];
  let invalidFound = false;
  let added = false; // yeni dosya eklendi mi?

  [...fileInput.files].forEach((file) => {
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      invalidFound = true;
    } else if (file.size > 16 * 1024 * 1024) {
      alert("✖ Maksimum dosya boyutu 16MB!");
    } else {
      const sizeKB = (file.size / 1024).toFixed(2);
      const item = document.createElement("p");
      item.textContent = `${file.name} (${sizeKB} KB)`;
      fileList.appendChild(item);
      added = true;
    }
  });

  if (invalidFound) {
    alert("✖ Sadece STL, OBJ veya ZIP dosyaları yükleyebilirsiniz!");
    fileList.innerHTML = ""; // listeyi temizle
  }

  // sadece başarılı dosya eklenirse input’u sıfırla
  if (added) {
    fileInput.value = "";
  }
});


document.addEventListener("DOMContentLoaded", () => {
  // Modal elemanları
  const modal = document.getElementById("policyModal");
  const link = document.getElementById("showPolicy");
  const closeBtn = document.querySelector(".close");

  // Modal açma
  link.onclick = (e) => {
    e.preventDefault();
    modal.style.display = "block";
  };

  // Modal kapatma (X butonu)
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  // Modal dışına tıklayınca kapat
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
});

const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("input", () => {
  let val = phoneInput.value;

  // Her zaman 0 ile başlasın
  if (!val.startsWith("0")) {
    val = "0" + val.replace(/^0+/, "");
  }

  // En fazla 11 karakter
  if (val.length > 11) {
    val = val.slice(0, 11);
  }

  phoneInput.value = val;
});

//toast message
function showToast(message, success = true) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.backgroundColor = success ? "#28a745" : "#dc3545"; // yeşil / kırmızı
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}






