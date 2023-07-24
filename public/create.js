const outputCanvas = document.getElementById("output-canvas");
const outputCtx = outputCanvas.getContext("2d");
const outputCanvasSize = 500;
const imageDelay = 1000 / 4; //delay of 200ms between two images
// outputCtx.webkitImageSmoothingEnabled = false;
// outputCtx.mozImageSmoothingEnabled = false;
outputCtx.imageSmoothingEnabled = false;
var faceCenters = [];

async function createAnimation() {
  console.log("starting recording...");

  // play it on another video element
  var video$ = document.createElement("video");
  document.body.appendChild(video$);

  record(outputCanvas, 5000).then((url) => {
    console.log("Video Recorded Successfully");
    video$.setAttribute("src", url);
    video$.autoplay = true;
    video$.loop = true;
    video$.play();
  });

  const dummyImages = document.querySelectorAll(".dummy-img");
  for (let i = 0; i < dummyImages.length; i++) {
    dummyImg = dummyImages[i];
    outputCtx.drawImage(
      dummyImg,
      outputCanvas.width / 2 - faceCenters[i].x,
      outputCanvas.height / 2 - faceCenters[i].y
    );
    await wait(imageDelay);
    outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
  }
  document.querySelector(".modal").style.display = "none";
}

function createCanvas() {
  if (window.orientationValue == "horizontal") {
    outputCanvas.width = outputCanvasSize;
    outputCanvas.height = (outputCanvasSize * 9) / 16;
  } else {
    outputCanvas.height = outputCanvasSize;
    outputCanvas.width = (outputCanvasSize * 9) / 16;
  }
}

async function getAlignedFaces(images) {
  document.querySelector(".modal .spinnerLabel").innerHTML =
    "Creating Video...";
  document.querySelector(".modal").style.display = "flex";

  await human.load();
  await human.warmup();

  for (let img of images) {
    inputCanvas.width = img.naturalWidth;
    inputCanvas.height = img.naturalHeight;
    inputCtx.drawImage(img, 0, 0, inputCanvas.width, inputCanvas.height);
    let detection = await detectFace(inputCanvas, img);
    if (detection == "ERROR_NO_FACE") {
      continue;
    }
    let face = detection.face[0];
    faceCenter = {
      x: face.box[0] + face.box[2] / 2,
      y: face.box[1] + face.box[3] / 2,
    };
    faceCenters.push(faceCenter);
  }

  createAnimation();
}

createButton.onclick = async () => {
  createCanvas();
  let images = document.querySelectorAll("#gallery img");
  await getAlignedFaces(images);
};
