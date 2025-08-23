import React from "react";

const AIIngredientInsights = ({ insights }) => {
  if (!Array.isArray(insights) || insights.length === 0) return null;
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold text-[#4f772d] mb-2">
        AI Ingredient Insights
      </h3>
      <p className="text-gray-600 text-sm mb-2">These are AI-generated health and nutrition insights for key ingredients.</p>
      {insights.map((item, i) => (
        <div
          key={i}
          className={`border-l-4 pl-4 mb-3 ${
            item.isConcern ? "border-red-500" : "border-green-500"
          }`}
        >
          <h4 className="font-bold text-gray-800">{item.ingredient}</h4>
          <p className="text-gray-600">
            {item.healthImpact?.status || item.healthImpact || ""}
          </p>
          {item.extraNote && (
            <p className="text-gray-500 text-sm italic">{item.extraNote}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AIIngredientInsights;
