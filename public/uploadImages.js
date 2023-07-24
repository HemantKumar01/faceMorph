const uploadInput = document.querySelector("#upload input");
const gallery = document.querySelector("#gallery");
const createButton = document.querySelector("#createButton");

uploadInput.addEventListener("change", (e) => {
  const allowedFileTypes = ["image/jpg", "image/png", "image/jpeg"];
  gallery.innerHTML = "";
  var validImageCount = 0;

  console.log("Selected: ", e.target.files);
  for (let file of e.target.files) {
    if (!allowedFileTypes.includes(file.type)) {
      continue;
    }
    gallery.innerHTML += `<div>
    <img class="h-auto max-w-full rounded-lg" src="${URL.createObjectURL(
      file
    )}" />
  </div>`;
    validImageCount++;
  }
  if (validImageCount > 0) {
    showSuccessAlert(`${validImageCount} Images Loaded Successfully`);
    var dummyImageContainer = document.querySelector("#dummy-image-container");
    for (let i = 0; i < validImageCount; i++) {
      dummyImageContainer.innerHTML += `<img class="dummy-img not-sourced">`;
    }
    document.querySelector("#gallery > div:last-child > img").onload = () => {
      createButton.classList.remove("hidden");
      createButton.scrollIntoView();
    };
  }
});
