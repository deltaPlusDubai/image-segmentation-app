"use client";

import { useRef, useState } from "react";
import CaptureButton from "./components/CaptureButton";
import LoadingSpinner from "./components/LoadingSpinner";
import ModalForm from "./components/ModalForm";
import VideoCanvasComponent from "./components/VideoCanvas";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRefSegmentation = useRef<HTMLCanvasElement | null>(null);
  const canvasRefFaceDetection = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const captureImage = () => {
    const segmentationCanvas = canvasRefSegmentation.current;
    const faceDetectionCanvas = canvasRefFaceDetection.current;

    if (!segmentationCanvas || !faceDetectionCanvas) return;

    // Create a temporary canvas to combine both canvases
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    if (!tempCtx) return;

    // Set the size of the temporary canvas
    tempCanvas.width = segmentationCanvas.width;
    tempCanvas.height = segmentationCanvas.height;

    // Draw the segmentation canvas first
    tempCtx.drawImage(segmentationCanvas, 0, 0);

    // Overlay the face detection canvas
    tempCtx.drawImage(faceDetectionCanvas, 0, 0);

    // Export the combined image as a Data URL
    const combinedImage = tempCanvas.toDataURL("image/png");

    // Set the combined image for preview
    setCapturedImage(combinedImage);
    setIsFormOpen(true);
  };
  const closeModal = () => {
    setCapturedImage(null);
    setIsFormOpen(false);
  };

  return (
    <>
      {isLoading ? <LoadingSpinner /> : <></>}

      <div className={`w-full h-full ${isLoading ? "hidden absolute" : ""}`}>
        <CaptureButton onClick={() => captureImage()} />

        <VideoCanvasComponent
          videoRef={videoRef}
          canvasRefSegmentation={canvasRefSegmentation}
          canvasRefFaceDetection={canvasRefFaceDetection}
          setIsLoading={setIsLoading}
        />
      </div>

      <ModalForm
        image={capturedImage}
        isOpen={isFormOpen}
        onClose={() => closeModal()}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
}
