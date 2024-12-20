export async function initializeSegmentation(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRefSegmentation: React.RefObject<HTMLCanvasElement | null>,
  resolution: { width: number; height: number }
) {
  const videoElement = videoRef.current;
  const canvasElement = canvasRefSegmentation.current;
  const canvasCtx = canvasElement?.getContext("2d");

  if (!videoElement || !canvasCtx) return;

  if (!(window as any).SelfieSegmentation) {
    console.error("SelfieSegmentation not loaded.");
    return;
  }

  const SelfieSegmentation = (window as any).SelfieSegmentation;
  const selfieSegmentation = new SelfieSegmentation({
    locateFile: (file: any) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
  });

  selfieSegmentation.setOptions({
    modelSelection: 1,
  });

  const backgroundImage = new Image();
  backgroundImage.src = "/custom-bg.jpg";

  selfieSegmentation.onResults((results: any) => {
    if (
      canvasElement!.width !== videoElement.videoWidth ||
      canvasElement!.height !== videoElement.videoHeight
    ) {
      canvasElement!.width = videoElement.videoWidth;
      canvasElement!.height = videoElement.videoHeight;
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement!.width, canvasElement!.height);
    canvasCtx.drawImage(
      videoElement!,
      0,
      0,
      canvasElement!.width,
      canvasElement!.height
    );

    canvasCtx.globalCompositeOperation = "destination-in";
    canvasCtx.drawImage(
      results.segmentationMask,
      0,
      0,
      canvasElement!.width,
      canvasElement!.height
    );

    canvasCtx.globalCompositeOperation = "destination-atop";
    canvasCtx.drawImage(
      backgroundImage!,
      0,
      0,
      canvasElement!.width,
      canvasElement!.height
    );

    canvasCtx.restore();
  });

  navigator.mediaDevices
    .getUserMedia({
      video: {
        width: { ideal: resolution.width },
        height: { ideal: resolution.height },
      },
    })
    .then((stream) => {
      videoElement.srcObject = stream;
      videoElement.play();
      async function sendFrame() {
        await selfieSegmentation.send({ image: videoElement });
        requestAnimationFrame(sendFrame);
      }
      sendFrame();
    })
    .catch((err) => {
      console.error("Error accessing camera:", err);
    });
}

// Selfie Segmentation
export async function loadMediaPipeScript() {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load MediaPipe script"));
    document.body.appendChild(script);
  });
}
