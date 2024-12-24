export async function initializeSegmentation(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRefSegmentation: React.RefObject<HTMLCanvasElement | null>,
  resolution: { width: number; height: number }
) {
  const videoElement = videoRef.current;
  const canvasElement = canvasRefSegmentation.current;
  const canvasCtx = canvasElement?.getContext("2d");

  if (!videoElement || !canvasCtx) return;

  const mpHolistic = window;

  const holistic = new (mpHolistic as any).Holistic({
    locateFile: (file: any) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@${
        (mpHolistic as any).VERSION
      }/${file}`,
  });

  const backgroundImage = new Image();
  backgroundImage.src = "/custom-bg.jpg";

  const crownImage = new Image();
  crownImage.src = "/crown-2.png";

  holistic.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    refineFaceLandmarks: true,
    minDetectionConfidence: 0.8,
    minTrackingConfidence: 0.8,
  });

  const drawConnectors = (window as any).drawConnectors;
  const drawLandmarks = (window as any).drawLandmarks;
  const POSE_CONNECTIONS = (window as any).POSE_CONNECTIONS;
  const FACEMESH_TESSELATION = (window as any).FACEMESH_TESSELATION;
  const HAND_CONNECTIONS = (window as any).HAND_CONNECTIONS;

  holistic.onResults((results: any) => {
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
      videoElement,
      0,
      0,
      canvasElement!.width,
      canvasElement!.height
    );

    // Only overwrite missing pixels.
    if (results.segmentationMask) {
      canvasCtx.globalCompositeOperation = "destination-in";
      canvasCtx.drawImage(
        results.segmentationMask,
        0,
        0,
        canvasElement!.width,
        canvasElement!.height
      );
    }

    // Only overwrite missing pixels.
    canvasCtx.globalCompositeOperation = "destination-atop";
    canvasCtx.drawImage(
      backgroundImage!,
      0,
      0,
      canvasElement!.width,
      canvasElement!.height
    );

    canvasCtx.globalCompositeOperation = "source-over";

    // drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
    //   color: "#00FF00",
    //   lineWidth: 4,
    // });
    // drawLandmarks(canvasCtx, results.poseLandmarks, {
    //   color: "#FF0000",
    //   lineWidth: 2,
    // });
    // drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
    //   color: "#C0C0C070",
    //   lineWidth: 1,
    // });
    // drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
    //   color: "#CC0000",
    //   lineWidth: 5,
    // });
    // drawLandmarks(canvasCtx, results.leftHandLandmarks, {
    //   color: "#00FF00",
    //   lineWidth: 2,
    // });
    // drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
    //   color: "#00CC00",
    //   lineWidth: 5,
    // });
    // drawLandmarks(canvasCtx, results.rightHandLandmarks, {
    //   color: "#FF0000",
    //   lineWidth: 2,
    // });

    // Detect specific gesture (e.g., thumbs up gesture)
    if (
      (results.leftHandLandmarks && isThumbsUp(results.leftHandLandmarks)) ||
      (results.rightHandLandmarks && isThumbsUp(results.rightHandLandmarks))
    ) {
      console.log("thumbs up detected....");
      // Get head coordinates
      const headLandmark = results.poseLandmarks?.[0]; // Nose
      if (headLandmark) {
        const crownWidth = 500; // Adjust crown size
        const crownHeight = 450;
        canvasCtx.drawImage(
          crownImage,
          headLandmark.x * canvasElement!.width - crownWidth / 2,
          headLandmark.y * canvasElement!.height - crownHeight - 100,
          crownWidth,
          crownHeight
        );
      }
    }

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
        await holistic.send({ image: videoElement });
        requestAnimationFrame(sendFrame);
      }
      sendFrame();
    })
    .catch((err) => {
      console.error("Error accessing camera:", err);
    });
}

// Helper function to detect thumbs-up gesture
function isThumbsUp(landmarks: any): boolean {
  // Define thumb-tip and index-tip positions
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  return thumbTip.y < indexTip.y; // Thumb is above the index finger
}

// Selfie Segmentation
export async function loadMediaPipeScript() {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.4/holistic.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load MediaPipe script"));
    document.body.appendChild(script);
  });
}

export async function loadMediaPipeScript_2() {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Camera Utils script"));
    document.body.appendChild(script);
  });
}

export async function loadMediaPipeScript_3() {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Control Utils script"));
    document.body.appendChild(script);
  });
}

export async function loadMediaPipeScript_4() {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Drawing Utils script"));
    document.body.appendChild(script);
  });
}
