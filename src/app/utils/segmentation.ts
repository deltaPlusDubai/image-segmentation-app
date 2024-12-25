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
    locateFile: (file: any) => {
      console.log("Loading file:", `/holistic/${file}`);
      return `/holistic/${file}`;
    },
  });

  const backgroundImage = new Image();
  backgroundImage.src = "/custom-bg.jpg";

  const crownImage = new Image();
  crownImage.src = "/crown-2.png";

  const smileEmojiImage = new Image();
  smileEmojiImage.src = "/smile-emoji.png";

  holistic.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    refineFaceLandmarks: true,
    minDetectionConfidence: 0.8,
    minTrackingConfidence: 0.8,
  });

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

    canvasCtx.globalCompositeOperation = "source-over";
    // Smile Detection Logic
    if (results.faceLandmarks && isSmiling(results.faceLandmarks)) {
      const headLandmark = results.poseLandmarks?.[0]; // Use nose as reference
      if (headLandmark) {
        const emojiWidth = 150; // Adjust emoji size
        const emojiHeight = 150;
        canvasCtx.drawImage(
          smileEmojiImage,
          headLandmark.x * canvasElement!.width - emojiWidth / 2,
          headLandmark.y * canvasElement!.height - emojiHeight - 250,
          emojiWidth,
          emojiHeight
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

function isSmiling(landmarks: any) {
  const leftMouthCorner = landmarks[61]; // Left mouth corner
  const rightMouthCorner = landmarks[291]; // Right mouth corner
  const topLip = landmarks[13]; // Top lip
  const bottomLip = landmarks[14]; // Bottom lip

  const mouthWidth = Math.abs(rightMouthCorner.x - leftMouthCorner.x);
  const mouthHeight = Math.abs(topLip.y - bottomLip.y);

  // Adjust thresholds based on testing
  const smileRatio = mouthWidth / mouthHeight;

  // A typical smile has a width-to-height ratio above 2.5
  return smileRatio > 0.5 && mouthHeight > 0.015; // Adjust mouthHeight threshold if needed
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
    script.src = "/holistic/holistic.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load MediaPipe script"));
    document.body.appendChild(script);
  });
}
