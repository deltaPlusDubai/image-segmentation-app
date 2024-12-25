"use client";

import { useRef, useState } from "react";
import CaptureButton from "./components/CaptureButton";
import LoadingSpinner from "./components/LoadingSpinner";
import ModalForm from "./components/ModalForm";
import VideoCanvasComponent from "./components/VideoCanvas";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRefSegmentation = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const captureImage = () => {
    const canvas = canvasRefSegmentation.current;
    if (!canvas) return;

    const image = canvas.toDataURL("image/png");
    setCapturedImage(image); // Set the captured image for preview
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
