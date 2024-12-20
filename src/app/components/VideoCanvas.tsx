"use client";

import { FaceDetector } from "@mediapipe/tasks-vision";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { detectFaces, setupFaceDetection } from "@/app/utils/faceDetection";
import {
  initializeSegmentation,
  loadMediaPipeScript,
} from "@/app/utils/segementations";

interface VideoCanvasComponentProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRefSegmentation: RefObject<HTMLCanvasElement | null>;
  canvasRefFaceDetection: RefObject<HTMLCanvasElement | null>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default function VideoCanvasComponent({
  videoRef,
  canvasRefSegmentation,
  canvasRefFaceDetection,
  setIsLoading,
}: VideoCanvasComponentProps) {
  const [faceDetector, setFaceDetector] = useState<FaceDetector | null>(null);
  const resolution = { width: 1280, height: 720 };

  useEffect(() => {
    loadMediaPipeScript().then(() => {
      initializeSegmentation(videoRef, canvasRefSegmentation, resolution).then(
        () => {
          setupFaceDetection(setFaceDetector).then(() => setIsLoading(false));
        }
      );
    });

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;

    const onLoadedData = () => {
      console.log("Video data loaded");
      if (faceDetector) {
        detectFaces(
          performance.now(),
          faceDetector,
          canvasRefFaceDetection,
          videoRef
        );
      }
    };

    if (videoElement) {
      videoElement.addEventListener("loadeddata", onLoadedData);
      return () => {
        videoElement.removeEventListener("loadeddata", onLoadedData);
      };
    }
  }, [faceDetector]);

  return (
    <div className="relative">
      <video ref={videoRef} className="w-full h-full" />
      <canvas
        ref={canvasRefSegmentation}
        className="absolute z-0 top-0 left-0 w-full h-full object-cover"
      />
      <canvas
        ref={canvasRefFaceDetection}
        className="absolute z-10 top-0 left-0 w-full h-full object-cover"
      />
    </div>
  );
}
