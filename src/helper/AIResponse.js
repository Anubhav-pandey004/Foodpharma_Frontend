import { toast } from "react-toastify";
import SummaryApi from "../common";

export const AIResponse = async ({
  ingredientsData,
  nutritionData,
  productName,
  navigate,
}) => {
  console.log("Sending data to AI backend...", {
    ingredientsData,
    nutritionData,
  });

  try {
    //First Get information about Ingredients
    let response = await fetch(SummaryApi.airesponse_ingredient.url, {
      method: SummaryApi.airesponse_ingredient.method || "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredientsData, productName }),
    });
    const ingredientsData_result = await response.json();
    console.log("AI Response Result for Ingredients :", ingredientsData_result);

    //Secondly Get information about Nutritions
    response = await fetch(SummaryApi.airesponse_nutrition.url, {
      method: SummaryApi.airesponse_nutrition.method || "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nutritionData, productName }),
    });
    const nutritionData_result = await response.json();
    console.log("AI Response Result for nutritionData :", nutritionData_result);
    const finalResult = {
      productName,
      ...nutritionData_result.data,
      ...ingredientsData_result.data,
    };
    console.log("This is acual data :\n", finalResult);

    // After i got response send it to result and save to Db
    // After that reset all states to null

    if (nutritionData_result.success) {
      navigate("/result", { state: finalResult });
      toast.success(
        nutritionData_result.message || "AI processed successfully!"
      );
    } else {
      toast.error(
        nutritionData_result.message || "Something went wrong with AI response."
      );
    }
  } catch (error) {
    console.error("Error in AIResponse:", error);
    toast.error("An error occurred while contacting AI service.");
  }
};
