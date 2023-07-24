const adjustments = document.querySelector("#adjustments");
const previewFaceImg = document.querySelector("img#previewFace");
const previewCanvas = adjustments.querySelector("canvas#adjustmentPreview");
const previewCtx = previewCanvas.getContext("2d");

const orientations = adjustments.querySelectorAll(
  "#orientationForm input[type=radio]"
);
const faceSize = adjustments.querySelector("#faceSize");

const previewCanvasSize = 200;

window.faceSize = faceSize.value;
window.orientationValue = "vertical";

previewCanvas.width = previewCanvasSize;
previewCanvas.height = (16 * previewCanvasSize) / 9;

function changeFaceSize() {
  window.faceSize = faceSize.value;
  //assuming previewFaceImg is a square. Else width or height of image depend on orientation
  previewFaceImg.width = (faceSize.value / 10) * previewCanvasSize;
  previewFaceImg.height = (faceSize.value / 10) * previewCanvasSize;

  previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  previewCtx.drawImage(
    previewFaceImg,
    (previewCanvas.width - previewFaceImg.width) / 2,
    (previewCanvas.height - previewFaceImg.height) / 2,
    previewFaceImg.width,
    previewFaceImg.height
  );
}

faceSize.onchange = changeFaceSize;

for (let orientationRadio of orientations) {
  orientationRadio.onchange = () => {
    if (orientationRadio.checked) {
      window.orientationValue = orientationRadio.value;
      if (orientationRadio.value == "horizontal") {
        previewCanvas.height = previewCanvasSize;
        previewCanvas.width = (16 * previewCanvasSize) / 9;
      } else {
        previewCanvas.width = previewCanvasSize;
        previewCanvas.height = (16 * previewCanvasSize) / 9;
      }
      changeFaceSize(); //to redraw face image
    }
  };
}

//for initially drawing face with default settings
changeFaceSize();
//in case image is not loaded yet
previewFaceImg.onload = () => {
  changeFaceSize();
};
