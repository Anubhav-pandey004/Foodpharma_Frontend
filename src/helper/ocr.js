import { recognize } from "tesseract.js";

const DEFAULT_OCR_URL = "https://ocr-backend-75i0.onrender.com/api/ocr/";

const requestRemoteOCR = async (image, signal) => {
  const endpoint = import.meta.env.VITE_OCR_BACKEND_URL?.trim() || DEFAULT_OCR_URL;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image }),
    signal,
  });

  const responseBody = await response.text();
  let data;

  try {
    data = JSON.parse(responseBody);
  } catch {
    throw new Error(`OCR service returned a non-JSON response (${response.status})`);
  }

  if (!response.ok) {
    throw new Error(data?.error || `OCR service request failed (${response.status})`);
  }

  if (typeof data?.text !== "string" || !data.text.trim()) {
    throw new Error("OCR service returned no recognized text");
  }

  return data.text.trim();
};

export const extractTextFromImage = async (image, signal) => {
  if (!image) {
    throw new Error("No image was captured. Please try again.");
  }

  try {
    return await requestRemoteOCR(image, signal);
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    console.warn("Remote OCR is unavailable. Using on-device OCR instead.");
  }

  const result = await recognize(image, "eng");
  const text = result.data.text.trim();

  if (!text) {
    throw new Error("No text was recognized. Try a clearer, closer image.");
  }

  return text;
};
