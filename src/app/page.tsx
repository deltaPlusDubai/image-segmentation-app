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
  const [cameraDisabled, setCameraDisabled] = useState(false);

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

      {cameraDisabled ? (
        <div className="flex w-full h-full justify-center items-center">
          <h1>Camera is disabled!</h1>
        </div>
      ) : (
        <>
          <div
            className={`w-full h-full ${isLoading ? "hidden absolute" : ""}`}
          >
            <CaptureButton onClick={() => captureImage()} />

            <img
              className="z-20 absolute bottom-[2rem] right-[2rem] mr-3 w-[15rem]"
              src="/ascenda/logo.png"
              alt="Ascenda Logo"
            />

            {/* <video
              src="/ascenda/particles.mp4"
              autoPlay
              loop
              className="h-full w-full object-cover"
            ></video> */}

            <VideoCanvasComponent
              videoRef={videoRef}
              canvasRefSegmentation={canvasRefSegmentation}
              setIsLoading={setIsLoading}
              setCameraDisabled={setCameraDisabled}
            />
          </div>
        </>
      )}

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
