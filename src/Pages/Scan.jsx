import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { FaRegKeyboard } from "react-icons/fa";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import BarcodeScanner from "../components/BarcodeScanner";
import OCRCapture from "../components/OCRCapture";
import ScanNutrition from "../components/ScanNutrition";
import { AIResponse } from "../helper/AIResponse";
import { FaBarcode } from "react-icons/fa6";
import { TbReportSearch } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
const Scan = () => {
  //barcode compo
  const codeReaderRef = useRef(null);
  const videoRef = useRef(null);
  const barcodeScannerRef = useRef(null);
  const scanningActiveRef = useRef(false);
  const [scannedCode, setScannedCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [productFound, setProductFound] = useState(null);
  const [barcodeScan, setBarcodeScan] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [productName, setProductName] = useState("");
  const [productNameSet, setProductNameSet] = useState(false);
  const navigate = useNavigate();

  //ing compo
  const [ingredientScanComplete, setIngredientScanComplete] = useState(false);
  const [ingredientsData, setIngredientData] = useState("");
  //nut compo
  const [nutritionScanComplete, setNutritionScanComplete] = useState(false);
  const [nutritionData, setNutritionData] = useState("");

  const startScanner = () => {
    if (!codeReaderRef.current) {
      codeReaderRef.current = new BrowserMultiFormatReader();
    }
    scanningActiveRef.current = true;
    setLoading(true);
    codeReaderRef.current.decodeFromConstraints(
      {
        video: { facingMode: "environment" },
      },
      videoRef.current,
      (result, err) => {
        if (!scanningActiveRef.current) return;
        setLoading(false);
        if (result) {
          const code = result.getText();
          setScannedCode(code);
          handleSendToBackend(code);

          // Stop camera stream
          const stream = videoRef.current?.srcObject;
          console.log("Stream :", stream);

          if (stream) {
            stream.getTracks().forEach((track, i) => {
              track.stop();
              console.log(
                `Track ${i}: kind=${track.kind}, readyState=${track.readyState}`
              );
            });

            videoRef.current.srcObject = null;
          }
          // Stop ZXing scanner
          if (typeof codeReaderRef.current.reset === "function")
            codeReaderRef.current.reset();
          if (typeof codeReaderRef.current.stopContinuousDecode === "function")
            codeReaderRef.current.stopContinuousDecode();
          scanningActiveRef.current = false;

          // Close the modal
          if (barcodeScannerRef.current) {
            barcodeScannerRef.current(); // Call stopStream via ref or handler
          }
          setBarcodeScan(false);
          return;
        }
        if (err && err.name !== "NotFoundException") {
          console.error("Scanning error: " + err.message);
        }
      }
    );
  };

  // Stop ZXing scanner when closing barcode scanner
  const handleBarcodeScanClose = () => {
    scanningActiveRef.current = false; // <-- Stop scan callback
    if (
      codeReaderRef.current &&
      typeof codeReaderRef.current.reset === "function"
    ) {
      codeReaderRef.current.reset();
    }
    if (
      codeReaderRef.current &&
      typeof codeReaderRef.current.stopContinuousDecode === "function"
    ) {
      codeReaderRef.current.stopContinuousDecode();
    }
    // Stop camera stream
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (barcodeScannerRef.current) {
      barcodeScannerRef.current(); // This calls stopStream in BarcodeScanner
    }
    setBarcodeScan(false);
  };

  const handleSendToBackend = async (code) => {
    try {
      const response = await fetch(SummaryApi.getData.url, {
        method: SummaryApi.getData.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        toast.success(result.message);
        setProductFound(true);
      } else {
        toast.error(result.message);
        setProductFound(false);
      }
    } catch (error) {
      toast.error("An error occurred while sending code.");
    }
  };

  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      toast.warn("Enter a barcode");
      return;
    }
    setScannedCode(manualCode.trim());
    handleSendToBackend(manualCode.trim());
    setManualCode("");
    setShowManualInput(false);
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      scanningActiveRef.current = false;
      if (
        codeReaderRef.current &&
        typeof codeReaderRef.current.reset === "function"
      ) {
        codeReaderRef.current.reset();
      }
      if (
        codeReaderRef.current &&
        typeof codeReaderRef.current.stopContinuousDecode === "function"
      ) {
        codeReaderRef.current.stopContinuousDecode();
      }
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  useEffect(() => {
    const fetchAIResponse = async () => {
      if (ingredientsData && nutritionData) {
        await AIResponse({ ingredientsData, nutritionData ,productName,navigate});
      }
    };

    fetchAIResponse();
  }, [ingredientsData, nutritionData]);

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      {!productNameSet && (
        <div className="w-full max-w-md flex flex-col items-center mb-8">
          <input
            type="text"
            placeholder="Enter Product Name"
            value={productName}
            onChange={e => setProductName(e.target.value)}
            className="w-full mb-2 px-4 py-2 text-lg rounded-lg border-2 border-dotted border-green-400 text-green-700 placeholder-green-300 focus:outline-none"
          />
          <button
            onClick={() => {
              if (productName.trim()) setProductNameSet(true);
              else toast.warn("Please enter a product name");
            }}
            className="bg-[#4f772d] text-[#fefae0] font-mono text-xl px-4 py-2 rounded-lg shadow hover:bg-[#3a5a40] transition"
          >
            Start
          </button>
        </div>
      )}
      {productNameSet && (
        <>
          <div className="lg:max-w-[45vw] mb-10 max-w-[70vw] text-center flex items-center flex-col">
            <h3
              className="lg:text-4xl text-2xl pt-2 font-extrabold text-[#4f772d] mb-4 tracking-tight flex items-center gap-2"
              style={{
                textShadow: "2px 2px 6px rgba(0, 0, 0, 0.3)",
              }}
            >
              Food Safety Scanner
            </h3>
            <h5 className="text-slate-500 text-sm w-full lg:text-xl">
              Scan any packaged food to get instant ingredient analysis, health
              recommendations, and safety alerts.
            </h5>
          </div>

          {/* <div className="w-[50vw] bg-white p-4 rounded-2xl shadow-lg flex gap-5"> */}
          <button
            className="bg-[#31572c] mb-3 bg-cover gap-4 cursor-pointer flex justify-center items-center text-4xl text-[#dde5b6]  h-[10vw] w-[90%] lg:w-[40%] border-dotted p-6 rounded-lg"
            style={{
              boxShadow:
                "0 30px 35px -20px rgba(0, 0, 0, 0.1), inset 0 9px 20px rgba(0, 0, 0, 0.15)",
            }}
            onClick={() => {
              setBarcodeScan((prev) => {
                const newValue = !prev;
                if (newValue) startScanner();
                return newValue;
              });
            }}
          >
            <FaBarcode />
            <p className="font-mono text-sm lg:text-2xl">Scan Barcode</p>
          </button>

          {barcodeScan && (
            <BarcodeScanner
              ref={barcodeScannerRef}
              setBarcodeScan={setBarcodeScan}
              barcodeScan={barcodeScan}
              loading={loading}
              videoRef={videoRef}
              codeReaderRef={codeReaderRef}
              onClose={handleBarcodeScanClose}
            />
          )}
          <button
            onClick={() => setShowManualInput(!showManualInput)}
            className="bg-[#31572c] mb-3 bg-cover gap-4 cursor-pointer flex justify-center items-center text-4xl text-[#dde5b6] h-[10vw] w-[90%] lg:w-[40%] border-dotted p-6 rounded-lg"
            style={{
              boxShadow:
                "0 30px 35px -20px rgba(0, 0, 0, 0.1), inset 0 9px 20px rgba(0, 0, 0, 0.15)",
            }}
          >
            <FaRegKeyboard className=""/>
            <p className="font-mono text-sm lg:text-2xl">Enter Barcode Manually</p>
          </button>

          {showManualInput && (
            <div className="w-[50%] mb-3 flex flex-col items-center">
              <input
                type="text"
                placeholder="Enter barcode"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="w-full mb-2 px-4 py-2 text-lg rounded-lg border-2 border-dotted border-blue-400 text-blue-700 placeholder-blue-300 focus:outline-none"
              />
              <button
                onClick={handleManualSubmit}
                className="bg-[#4f772d] text-[#fefae0] font-mono text-xl px-4 py-2 rounded-lg shadow hover:bg-[#3a5a40] transition"
              >
                Submit
              </button>
            </div>
          )}

          <div
            className="bg-[#90a955] mb-3 bg-cover gap-4 cursor-pointer flex justify-center items-center text-4xl text-[#dde5b6]  h-[17vw] lg:h-[10vw] w-[90%] lg:w-[40%] border-dotted p-6 rounded-lg"
            style={{
              boxShadow:
                "0 30px 35px -20px rgba(0, 0, 0, 0.1), inset 0 9px 20px rgba(0, 0, 0, 0.15)",
            }}
            onClick={() => {
              setIngredientScanComplete((prev) => {
                const newValue = !prev;
                return newValue;
              });
            }}
          >
            {/* <FaRegKeyboard /> */}
            <TbReportSearch className="text-8xl" />
            <p className="font-mono text-sm lg:text-2xl">
              Scan Ingredients/ Nutrition Label
              <span className=" lg:text-sm">(Recommended)</span>
            </p>
          </div>
          {ingredientScanComplete && (
            <OCRCapture
              ingredientScanComplete={ingredientScanComplete}
              setIngredientScanComplete={setIngredientScanComplete}
              ingredientsData={ingredientsData}
              setIngredientsData={setIngredientData}
              nutritionScanComplete={nutritionScanComplete}
              setNutritionScanComplete={setNutritionScanComplete}
            />
          )}
          {nutritionScanComplete && (
            <ScanNutrition
              nutritionData={nutritionData}
              setNutritionData={setNutritionData}
              nutritionScanComplete={nutritionScanComplete}
              setNutritionScanComplete={setNutritionScanComplete}
              setIngredientScanComplete={setIngredientScanComplete}
              ingredientScanComplete={ingredientScanComplete}
            />
          )}
          {/* </div> */}
        </>
      )}
    </div>
  );
};

export default Scan;
