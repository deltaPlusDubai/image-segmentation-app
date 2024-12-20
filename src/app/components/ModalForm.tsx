import React, { ChangeEvent, FormEvent } from "react";

type ModalFormProps = {
  image: string | null;
  isOpen: boolean;
  onClose: () => void;
  formData: { name: string; email: string };
  setFormData: (e: any) => void;
};

export default function ModalForm({
  image,
  isOpen,
  onClose,
  formData,
  setFormData,
}: ModalFormProps) {

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Call your mail API
      console.log({
        name: formData.name,
        email: formData.email,
      });
      // const response = await fetch("/api/send-mail", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     name: formData.name,
      //     email: formData.email,
      //     image: capturedImage, // Send captured image
      //   }),
      // });

      // if (response.ok) {
      //   alert("Email sent successfully!");
      //   closeModal();
      // } else {
      //   alert("Failed to send email. Please try again.");
      // }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-xl sm:max-w-xl">
        <h2
          className="text-black font-bold mb-4"
          style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }}
        >
          Share Captured Image
        </h2>
        <img
          src={image!}
          alt="Captured"
          className="mb-4 rounded object-cover w-full max-h-64"
        />
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-medium text-gray-900"
              style={{ fontSize: "clamp(0.9rem, 1.5vw, 1rem)" }}
            >
              Name
            </label>
            <input
              value={formData.name}
              onChange={handleInputChange}
              type="text"
              name="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="John"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
              style={{ fontSize: "clamp(0.9rem, 1.5vw, 1rem)" }}
            >
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="john.doe@company.com"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              style={{ fontSize: "clamp(0.9rem, 1.5vw, 1rem)" }}
            >
              Share
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              style={{ fontSize: "clamp(0.9rem, 1.5vw, 1rem)" }}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
