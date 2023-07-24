function record(canvas, time = 4000) {
  var recordedChunks = [];
  return new Promise(function (res, rej) {
    var stream = canvas.captureStream(25 /*fps*/);

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs:vp9",
    });

    //ondataavailable will fire in interval of `time || 4000 ms`
    mediaRecorder.start(time);
    setTimeout(() => {
      mediaRecorder.stop();
    }, time);
    mediaRecorder.ondataavailable = function (event) {
      recordedChunks.push(event.data);
      // after stop `dataavilable` event run one more time
      if (mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
    };

    mediaRecorder.onstop = function (event) {
      var blob = new Blob(recordedChunks, { type: "video/webm" });
      var url = URL.createObjectURL(blob);
      res(url);
    };
  });
}
