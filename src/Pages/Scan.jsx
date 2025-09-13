import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { toast } from "react-toastify";
import SummaryApi from "../common";

import OCRCapture from "../components/OCRCapture";
import ScanNutrition from "../components/ScanNutrition";
import { AIResponse } from "../helper/AIResponse";
import FancyLoader from '../components/FancyLoader';
import { TbReportSearch } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
const Scan = () => {
  //barcode compo
  const codeReaderRef = useRef(null);
  const videoRef = useRef(null);
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
  const [aiLoading, setAiLoading] = useState(false);

  //ing compo
  const [ingredientScanComplete, setIngredientScanComplete] = useState(false);
  const [ingredientsData, setIngredientData] = useState("");
  //nut compo
  const [nutritionScanComplete, setNutritionScanComplete] = useState(false);
  const [nutritionData, setNutritionData] = useState("");




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
        await AIResponse({ ingredientsData, nutritionData ,productName, barcode: scannedCode, navigate, onLoadingChange: setAiLoading });
      }
    };

    fetchAIResponse();
  }, [ingredientsData, nutritionData]);

  return (
    <div className="min-h-screen p-6 flex flex-col items-center relative">
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
      {aiLoading && (
        <FancyLoader show={true} label="Analyzing with AI..." />
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
