// import {
//   Detection,
//   FaceDetector,
//   FilesetResolver,
// } from "@mediapipe/tasks-vision";
// import { RefObject, SetStateAction } from "react";

// export async function setupFaceDetection(
//   setFaceDetector: (value: SetStateAction<FaceDetector | null>) => void
// ) {
//   try {
//     const vision = await FilesetResolver.forVisionTasks(
//       "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
//     );
//     const detector = await FaceDetector.createFromOptions(vision, {
//       baseOptions: {
//         modelAssetPath:
//           "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
//         delegate: "GPU",
//       },
//       runningMode: "VIDEO",
//       minDetectionConfidence: 0.8,
//     });
//     setFaceDetector(detector);
//   } catch (error) {
//     console.error("Error initializing face detection:", error);
//   }
// }

// const keypointHistory: { x: number; y: number }[] = []; // Store previous keypoints
// const maxHistory = 5; // Number of frames to average

// const smoothKeypoint = (keypoint: { x: number; y: number }) => {
//   keypointHistory.push(keypoint);
//   if (keypointHistory.length > maxHistory) {
//     keypointHistory.shift(); // Remove oldest entry
//   }

//   // Compute average position
//   const avgX =
//     keypointHistory.reduce((sum, point) => sum + point.x, 0) /
//     keypointHistory.length;
//   const avgY =
//     keypointHistory.reduce((sum, point) => sum + point.y, 0) /
//     keypointHistory.length;

//   return { x: avgX, y: avgY };
// };

// export function displayVideoDetections(
//   detections: Detection[],
//   canvasRefFaceDetection: React.RefObject<HTMLCanvasElement | null>
// ) {
//   const canvas = canvasRefFaceDetection.current;
//   const ctx = canvas?.getContext("2d");

//   if (!ctx) return;

//   ctx.clearRect(0, 0, canvas!.width, canvas!.height);

//   detections.forEach((detection) => {
//     const { originX, originY, width, height }: any = detection.boundingBox;

//     ctx.strokeStyle = "red";
//     ctx.lineWidth = 4;
//     ctx.strokeRect(
//       originX * canvas!.width,
//       originY * canvas!.height,
//       width * canvas!.width,
//       height * canvas!.height
//     );

//     const confidence = Math.round(detection.categories[0].score * 100);
//     ctx.fillStyle = "red";
//     ctx.font = "16px Arial";
//     ctx.fillText(
//       `${confidence}%`,
//       originX * canvas!.width,
//       originY * canvas!.height - 10
//     );

//     const image = new Image();
//     image.src = "/crown-2.png"; // Replace with the path to your image

//     //   const keypoint = detection.keypoints[0]; // Use the first keypoint (e.g., nose)
//     const smoothedKeypoint = smoothKeypoint({
//       x: detection.keypoints[0].x,
//       y: detection.keypoints[0].y,
//     });
//     const keypointX = smoothedKeypoint.x * canvas!.width;
//     const keypointY = smoothedKeypoint.y * canvas!.height;

//     const imageWidth = 400; // Set the desired width for the image
//     const imageHeight = 400; // Set the desired height for the image

//     ctx.drawImage(
//       image,
//       keypointX - image.width / 10,
//       keypointY - image.height + 1450,
//       imageWidth, // Width of the resized image
//       imageHeight
//     );
//   });
// }

// export async function detectFaces(
//   currentTimeMs: number,
//   faceDetector: FaceDetector | null,
//   canvasRefFaceDetection: RefObject<HTMLCanvasElement | null>,
//   videoRef: RefObject<HTMLVideoElement | null>
// ) {
//   if (!faceDetector || !videoRef.current || !canvasRefFaceDetection.current)
//     return;

//   const canvas = canvasRefFaceDetection.current;
//   const video = videoRef.current;

//   if (video.videoWidth === 0 || video.videoHeight === 0) {
//     console.log("Waiting for video dimensions...");
//     return;
//   }

//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;

//   const ctx = canvas.getContext("2d");
//   ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

//   try {
//     const detections = faceDetector.detectForVideo(video, currentTimeMs);
//     if (detections && detections.detections) {
//       displayVideoDetections(detections.detections, canvasRefFaceDetection);
//     }
//   } catch (error) {
//     console.error("Error during face detection:", error);
//   }

//   requestAnimationFrame(() =>
//     detectFaces(
//       performance.now(),
//       faceDetector,
//       canvasRefFaceDetection,
//       videoRef
//     )
//   );
// }
