// Gunakan library pose, bukan image
const URL = "https://teachablemachine.withgoogle.com/models/2yEqkW4kP/";
let model, webcam, ctx, labelContainer, maxPredictions;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // Load model pose
  model = await tmPose.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Setup webcam
  const size = 400;
  const flip = true;
  webcam = new tmPose.Webcam(size, size, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam-container").appendChild(webcam.canvas);
  ctx = webcam.canvas.getContext("2d");
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  // pose estimation
  const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
  const prediction = await model.predict(posenetOutput);

  let highestProb = 0;
  let posture = "-";

  prediction.forEach((p) => {
    if (p.probability > highestProb) {
      highestProb = p.probability;
      posture = p.className;
    }
  });

  document.getElementById("output").innerText = "Postur badan: " + posture;

  // gambar pose ke canvas
  ctx.drawImage(webcam.canvas, 0, 0);
  if (pose) {
    tmPose.drawPose(pose, ctx);
    tmPose.drawKeypoints(pose.keypoints, 0.6, ctx);
  }
}
