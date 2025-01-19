import { Dispatch, SetStateAction } from "react";

export async function initializeSegmentation(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRefSegmentation: React.RefObject<HTMLCanvasElement | null>,
  resolution: { width: number; height: number },
  setCameraDisabled: Dispatch<SetStateAction<boolean>>
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
  backgroundImage.src = "/ascenda/bg.webp";

  const scaleImg = new Image();
  scaleImg.src = "/ascenda/scale.png";

  // const ascendaNestleLogo = new Image();
  // ascendaNestleLogo.src = "/ascenda/logo.png";

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

    // Ensure pose landmarks are detected and draw the tracked image
    if (results.poseLandmarks) {
      const nose = results.poseLandmarks?.[0]; // Nose landmark (top of the head)
      const leftHip = results.poseLandmarks?.[23]; // Left hip landmark
      const leftShoulder = results.poseLandmarks?.[11]; // Left shoulder landmark

      if (nose && leftHip && leftShoulder) {
        // Calculate the height dynamically from head to waist
        const headToWaistHeight = (leftHip.y - nose.y) * canvasElement!.height;

        // Set dynamic image size
        const scaleWidth = canvasElement!.width * 0.06; // Adjusted width for a better fit
        const scaleHeight = headToWaistHeight; // Height matches head to waist span

        // Position image on the left side of the canvas
        const offsetX =
          leftShoulder.x * canvasElement!.width - scaleWidth * 2.6; // Adjust left shift
        const offsetY = nose.y * canvasElement!.height - 50; // Slightly above the top of the head

        // Draw the image
        canvasCtx.drawImage(
          scaleImg,
          offsetX,
          offsetY,
          scaleWidth,
          scaleHeight
        );
      }
    }

    // canvasCtx.globalCompositeOperation = "source-over";
    // // Add static company logo on the bottom-right corner
    // const logoWidth = canvasElement!.width * 0.15; // Set logo width to 15% of canvas width
    // const logoHeight = canvasElement!.height * 0.1; // Set logo height to 10% of canvas height
    // const logoOffsetX = canvasElement!.width - logoWidth - 50; // 20px padding from the right edge
    // const logoOffsetY = canvasElement!.height - logoHeight - 40; // 20px padding from the bottom edge

    // // Draw the company logo
    // canvasCtx.drawImage(
    //   ascendaNestleLogo, // The image object for your company logo
    //   logoOffsetX,
    //   logoOffsetY,
    //   logoWidth,
    //   logoHeight
    // );

    // canvasCtx.globalCompositeOperation = "source-over";
    // // Smile Detection Logic
    // if (results.faceLandmarks && isSmiling(results.faceLandmarks)) {
    // const headLandmark = results.poseLandmarks?.[0]; // Use nose as reference
    // if (headLandmark) {
    //   const emojiWidth = 150; // Adjust emoji size
    //   const emojiHeight = 150;
    //   canvasCtx.drawImage(
    //     smileEmojiImage,
    //     headLandmark.x * canvasElement!.width - emojiWidth / 2,
    //     headLandmark.y * canvasElement!.height - emojiHeight - 250,
    //     emojiWidth,
    //     emojiHeight
    //   );
    // }
    // }

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
      setCameraDisabled(true);
      console.error("Error accessing camera:", err);
    });
}

// function isSmiling(landmarks: any) {
//   const leftMouthCorner = landmarks[61]; // Left mouth corner
//   const rightMouthCorner = landmarks[291]; // Right mouth corner
//   const topLip = landmarks[13]; // Top lip
//   const bottomLip = landmarks[14]; // Bottom lip

//   const mouthWidth = Math.abs(rightMouthCorner.x - leftMouthCorner.x);
//   const mouthHeight = Math.abs(topLip.y - bottomLip.y);

//   // Adjust thresholds based on testing
//   const smileRatio = mouthWidth / mouthHeight;

//   // A typical smile has a width-to-height ratio above 2.5
//   return smileRatio > 0.5 && mouthHeight > 0.015; // Adjust mouthHeight threshold if needed
// }

// // Helper function to detect thumbs-up gesture
// function isThumbsUp(landmarks: any): boolean {
//   // Define thumb-tip and index-tip positions
//   const thumbTip = landmarks[4];
//   const indexTip = landmarks[8];
//   return thumbTip.y < indexTip.y; // Thumb is above the index finger
// }

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
