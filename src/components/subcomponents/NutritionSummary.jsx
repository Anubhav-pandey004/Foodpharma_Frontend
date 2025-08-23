import React from "react";

const NutritionSummary = ({ summary }) => {
  if (!summary) return null;
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold text-[#4f772d] mb-2">
        Nutrition Summary
      </h3>
      {summary.servingSizeNote && (
        <p className="font-medium text-sm text-gray-700 mb-2">
          🍽️ {summary.servingSizeNote}
        </p>
      )}
      {summary.keyPoints?.length > 0 && (
        <ul className="list-disc list-inside text-gray-700 mb-2">
          {summary.keyPoints.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      )}
      {summary.simpleTips?.length > 0 && (
        <div className="text-sm text-blue-700 italic">
          💡 Tips:
          <ul className="list-disc list-inside ml-4">
            {summary.simpleTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NutritionSummary;
