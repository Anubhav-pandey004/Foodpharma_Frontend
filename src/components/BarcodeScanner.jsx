import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import Webcam from "react-webcam";

const BarcodeScanner = forwardRef(
  (
    {
      setBarcodeScan,
      barcodeScan,
      videoRef,
      loading,
      onStartScan,
      onUpload,
      codeReaderRef,
      onClose,
    },
    ref
  ) => {
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState("");
    const webcamInternalRef = useRef(null);

    // Fetch available video input devices
    useEffect(() => {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        setDevices(videoDevices);
        if (videoDevices.length) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      });
    }, []);

    // Assign webcam stream to videoRef for ZXing
    useEffect(() => {
      if (webcamInternalRef.current && videoRef) {
        // Wait for webcam to be ready
        const interval = setInterval(() => {
          const videoElem = webcamInternalRef.current.video;
          if (videoElem && videoElem.srcObject) {
            videoRef.current = videoElem;
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    }, [selectedDeviceId, videoRef]);

    const handleClose = () => {
      stopWebcam();
      if (onClose) onClose();
      else setBarcodeScan(false);
    };
    const stopWebcam = () => {
      const video = webcamInternalRef.current?.video;
      if (video?.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }

      // Stop ZXing scanner if codeReaderRef is provided
      if (codeReaderRef?.current) {
        if (typeof codeReaderRef.current.reset === "function") {
          codeReaderRef.current.reset();
        }
        if (typeof codeReaderRef.current.stopContinuousDecode === "function") {
          codeReaderRef.current.stopContinuousDecode();
        }
      }

      console.log("Camera and ZXing scanner stopped");
    };

    return (
      <div className="fixed  top-0 left-0 bg-[#000000b5] w-screen h-screen">
        <div className="flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center space-y-4 p-6 bg-[#a7c957] rounded-xl shadow-md max-w-md mx-auto mt-6">

          <div className="relative w-full">
            <div className="absolute inset-0 z-10 pointer-events-none border-4 border-[#ecf39e] rounded-xl animate-pulse" />
            <Webcam
              ref={webcamInternalRef}
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
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-20">
                <div className="text-green-600 animate-spin text-xl font-bold">
                  |
                </div>
              </div>
            )}
          </div>

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
            onClick={handleClose}
            className="bg-gradient-to-br from-[#b5e48c] to-[#132a13] shadow-2xl cursor-pointer text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
);

export default BarcodeScanner;
