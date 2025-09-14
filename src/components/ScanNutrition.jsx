import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import FancyLoader from './FancyLoader';

const ScanNutrition = ({
  nutritionData,
  setNutritionData,
  nutritionScanComplete,
  setNutritionScanComplete,
}) => {
  const webcamRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [sendingPicture, setSendingPicture] = useState(false);
  const abortControllerRef = useRef(null);
  const ocrurl = import.meta.env.VITE_OCR_BACKEND_URL || "https://ocr-backend-1-3py5.onrender.com";

  // Fetch available video input devices
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((allDevices) => {
      const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
      setDevices(videoDevices);
      if (videoDevices.length) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    });
  }, []);

  // Stop webcam stream and revoke camera permission
  const stopWebcam = () => {
    if (webcamRef.current && webcamRef.current.stream) {
      webcamRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const captureAndSend = async (base64Image) => {
    const image = base64Image || webcamRef.current.getScreenshot();
    try {
      //Is it linked with that fetch request only?
      // Yes!
      // When you pass signal: abortController.signal to a fetch, that fetch is "linked" to that specific controller.
      // If you call abortController.abort(), only fetches using that controller’s signal will be aborted.
      // If you use the same controller for multiple fetches, aborting one will abort all.
      abortControllerRef.current = new AbortController();
      const res = await fetch(ocrurl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
        signal: abortControllerRef.current.signal,
      });
      const data = await res.json();
      setNutritionData(data.text);
      setNutritionScanComplete(!nutritionScanComplete);
      stopWebcam(); // Stop camera after capture
      setSendingPicture(false);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("OCR request aborted");
      } else {
        console.error("OCR failed:", error);
      }
      setSendingPicture(false);
    }
  };

  const handleUpload = (file) => {
    setSendingPicture(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64Image = ev.target.result;
      await captureAndSend(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setNutritionScanComplete(!nutritionScanComplete);
    stopWebcam(); // Stop camera on close
  };

  return (
    <div className="fixed top-0 left-0 bg-[#000000b5] w-screen h-screen z-50">
      <div className="flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center space-y-4 p-6 bg-[#a7c957] rounded-xl shadow-md max-w-md mx-auto mt-6">
        <p className="text-[#132a13] font-semibold">Scan Nutrition</p>
        <div className="relative w-full">
          <div className="absolute inset-0 z-10 pointer-events-none border-4 border-[#ecf39e] rounded-xl animate-pulse" />
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            // mirrored={true}
            className="w-full aspect-video rounded-xl"
            videoConstraints={{
              deviceId: selectedDeviceId
                ? { exact: selectedDeviceId }
                : undefined,
              facingMode: "environment",
              width: 1280,
              height: 720,
            }}
          />
        </div>
        {sendingPicture && (
          <FancyLoader show={true} label="Scanning nutrition..." />
        )}
        <label className="text-sm">
          Select Camera ({devices.length})
          <select
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            className="ml-2 px-2 py-1 border rounded"
          >
            {devices.map((device, i) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${i + 1}`}
              </option>
            ))}
          </select>
        </label>
        <button
          className={`bg-[#ecf39e] text-[#132a13] px-4 py-2 rounded shadow-lg font-semibold hover:bg-green-50 hover:border-green-600 transition-all duration-200 cursor-pointer${
            sendingPicture ? " opacity-60 pointer-events-none" : ""
          }`}
          disabled={sendingPicture}
          onClick={() => {
            setSendingPicture(true);
            captureAndSend();
          }}
        >
          Take Picture
        </button>
        <div className="flex flex-col items-center w-full">
          <label
            htmlFor="barcode-upload"
            className={`bg-[#ecf39e] text-[#132a13] px-2 py-2 rounded shadow-lg font-semibold hover:bg-green-50 hover:border-green-600 transition-all duration-200 cursor-pointer${
              sendingPicture ? " opacity-60 pointer-events-none" : ""
            }`}
          >
            Upload Image
            <input
              id="barcode-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files[0])}
              disabled={sendingPicture}
            />
          </label>
        </div>
        <button
          className={`bg-gradient-to-br from-[#b5e48c] to-[#132a13] shadow-2xl cursor-pointer text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium${
              sendingPicture ? " opacity-60 pointer-events-none" : ""
            }`}
          onClick={handleClose}
          disabled={sendingPicture}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ScanNutrition;
