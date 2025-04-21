const URL = "https://teachablemachine.withgoogle.com/models/oTtv--EQC/";
let model, webcam, labelContainer, maxPredictions;

async function init() {
  try {
    console.log("🔄 Memuat model...");
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    console.log("✅ Model berhasil dimuat.");

    const flip = true;
    webcam = new tmImage.Webcam(400, 300, flip);

    console.log("🎥 Minta izin akses webcam...");
    await webcam.setup();
    console.log("✅ Akses webcam diberikan!");

    await webcam.play();
    console.log("🎬 Webcam berjalan.");

    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
      labelContainer.appendChild(document.createElement("div"));
    }
  } catch (err) {
    console.error("❌ ERROR saat inisialisasi:", err);
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

init();
