import React from "react";

type CaptureButtonProps = {
  onClick: () => void;
};

export default function CaptureButton({ onClick }: CaptureButtonProps) {
  return (
    <button
      type="button"
      className="z-20 absolute bottom-[2rem] right-[2rem] bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg px-5 py-2.5 text-center flex items-center justify-center"
      style={{ width: "15vw", height: "7vh" }}
      onClick={onClick}
    >
      <img
        className="mr-2"
        style={{ width: "20%", height: "55%" }}
        src="/photo-camera.svg"
        alt="Camera Icon"
      />
      <span style={{ fontSize: "clamp(0.8rem, 2vw, 1.5rem)" }}>
        Capture Image
      </span>
    </button>
  );
}
