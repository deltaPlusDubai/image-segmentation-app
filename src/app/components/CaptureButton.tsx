import React from "react";

type CaptureButtonProps = {
  onClick: () => void;
};

export default function CaptureButton({ onClick }: CaptureButtonProps) {
  return (
    <button
      type="button"
      className="z-20 absolute bottom-[2rem] left-[2rem] bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg px-5 py-2.5 text-center flex items-center justify-center"
      onClick={onClick}
    >
      <img
        className="mr-3 w-[1.7rem]"
        src="/photo-camera.svg"
        alt="Camera Icon"
      />
      <span className="text-[1.3rem]">Capture Image</span>
    </button>
  );
}
