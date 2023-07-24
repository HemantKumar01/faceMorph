function drawRotatedScaled(canvas, img, rotation = 0, scale = 1) {
  /*
  Rotation is in radians
  */
  canvas.width =
    Math.abs(Math.sin(rotation) * img.clientHeight) +
    Math.abs(Math.cos(rotation) * img.clientWidth);
  canvas.height =
    Math.abs(Math.cos(rotation) * img.clientHeight) +
    Math.abs(Math.sin(rotation) * img.clientWidth);

  canvas.width *= scale;
  canvas.height *= scale;

  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.translate(canvas.width / 2, canvas.height / 2);

  context.scale(scale, scale);
  context.rotate(rotation);

  context.drawImage(
    img,
    -img.clientWidth / 2,
    -img.clientHeight / 2,
    img.clientWidth,
    img.clientHeight
  );
  context.restore();
}

// create instance of human with simple configuration using default values
const config = {
  backend: "wasm",
  debug: true,
  modelBasePath: "https://cdn.jsdelivr.net/gh/vladmandic/human-models/models/",
  face: {
    enabled: true,
    detector: {
      maxDetected: 1,
      minConfidence: 0.2,
      return: true,
    },
    iris: { enabled: false },
    description: { enabled: false },
    emotion: { enabled: false },
    antispoof: { enabled: true },
    liveness: { enabled: true },
  },
  body: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
  gesture: { enabled: false },
  segmentation: { enabled: false },
};
const human = new Human.Human(config);
// select input HTMLVideoElement and output HTMLCanvasElement from page
// const image = document.querySelector("img.input-img");
const inputCanvas = document.querySelector("canvas.input-canvas");
const inputCtx = inputCanvas.getContext("2d");

async function detectFace(canvas, img, isRepeated = false) {
  var context = canvas.getContext("2d");
  // perform processing using default configuration
  var result = await human.detect(canvas);
  // result object will contain detected details
  // as well as the processed canvas itself
  // so lets first draw processed frame on canvas
  human.draw.canvas(result.canvas, canvas);

  if (!isRepeated) {
    if (result.face.length == 0) {
      document
        .querySelector("#dummy-image-container")
        .removeChild(
          document.querySelectorAll(
            "#dummy-image-container img.dummy-img.not-sourced"
          )[0]
        );
      return "ERROR_NO_FACE";
    }
    drawRotatedScaled(canvas, img, -1 * result.face[0].rotation.angle.roll, 1);
    result = await detectFace(canvas, img, true);
  } else {
    let scale =
      ((window.faceSize / 10) * outputCanvasSize) /
      Math.max(result.face[0].box[2], result.face[0].box[3]); // box is [x, y, w, h]
    let dummyImg = document.querySelectorAll(
      "#dummy-image-container img.dummy-img.not-sourced"
    )[0];
    //preparing dummy image for scaling
    dummyImg.height = canvas.height;
    dummyImg.width = canvas.width;
    dummyImg.src = canvas.toDataURL();
    await dummyImg.decode();
    drawRotatedScaled(canvas, dummyImg, 0, scale);
    //setting dummy image as scaled image
    dummyImg.height = canvas.height;
    dummyImg.width = canvas.width;
    dummyImg.src = canvas.toDataURL();
    await dummyImg.decode();
    dummyImg.classList.remove("not-sourced");

    result.face[0].box = result.face[0].box.map((x) => {
      return x * scale;
    });
  }

  return result;
}

// image.onload = async () => {
//   inputCanvas.width = image.clientWidth;
//   inputCanvas.height = image.clientHeight;
//   ctx.drawImage(image, 0, 0, inputCanvas.width, inputCanvas.height);
//   await human.load();
//   await human.warmup();
//   document.querySelector(".modal").style.display = "none";
//   detectFace();
// };

// image.src = "media/image3.jpg";
