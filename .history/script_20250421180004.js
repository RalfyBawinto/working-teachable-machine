// const URL = "https://teachablemachine.withgoogle.com/models/oTtv--EQC/";

let model, webcam, labelContainer, maxPredictions;

async function init() {
  const video = document.getElementById("video");

  try {
    console.log("🔄 Memuat model...");
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    console.log("✅ Model berhasil dimuat.");

    // Setup webcam manual tanpa tmImage.Webcam
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      video.play();
      loop();
    };

    // Siapkan label container
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
      labelContainer.appendChild(document.createElement("div"));
    }
  } catch (error) {
    console.error("❌ Gagal mengakses kamera atau model:", error);
    alert("Gagal mengakses kamera atau model.");
  }
}

async function loop() {
  if (!model) return;

  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(document.getElementById("video"));
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction = `${prediction[i].className}: ${(
      prediction[i].probability * 100
    ).toFixed(2)}%`;
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}
