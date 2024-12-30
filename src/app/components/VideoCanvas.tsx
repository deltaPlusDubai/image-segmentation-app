"use client";

import {
  initializeSegmentation,
  loadMediaPipeScript,
} from "@/app/utils/segmentation";
import { Dispatch, RefObject, SetStateAction, useEffect } from "react";

interface VideoCanvasComponentProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRefSegmentation: RefObject<HTMLCanvasElement | null>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setCameraDisabled: Dispatch<SetStateAction<boolean>>;
}

export default function VideoCanvasComponent({
  videoRef,
  canvasRefSegmentation,
  setIsLoading,
  setCameraDisabled,
}: VideoCanvasComponentProps) {
  const resolution = { width: 1280, height: 720 };

  useEffect(() => {
    loadMediaPipeScript().then(() => {
      console.log("Script loaded successfully");
      initializeSegmentation(
        videoRef,
        canvasRefSegmentation,
        resolution,
        setCameraDisabled
      )
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => console.error("Script loading error:", err));
    });

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <video ref={videoRef} className="w-full h-full" />
      <canvas
        ref={canvasRefSegmentation}
        className="absolute z-0 top-0 left-0 w-full h-full object-cover"
      />
    </div>
  );
}
