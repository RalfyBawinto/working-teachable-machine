const URL = "https://teachablemachine.withgoogle.com/models/oTtv--EQC/";
let model, webcam, labelContainer, maxPredictions;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // Load model dan metadata
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Setup webcam
  const flip = true; // kamera depan
  webcam = new tmImage.Webcam(400, 300, flip);
  await webcam.setup(); // minta izin kamera
  await webcam.play();
  window.requestAnimationFrame(loop);

  // Tampilkan webcam
  document.getElementById("webcam-container").appendChild(webcam.canvas);

  // Tampilkan container hasil prediksi
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className +
      ": " +
      (prediction[i].probability * 100).toFixed(2) +
      "%";
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}

// Jalankan saat script dimuat
init();
