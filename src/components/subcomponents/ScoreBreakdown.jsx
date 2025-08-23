import React from "react";

const ScoreBreakdown = ({ scoreKeys, Rating, getScoreBarColor }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mt-2">
      <h4 className="font-semibold text-[#4f772d] mb-2 flex items-center gap-2">
        <span role="img" aria-label="chart">📊</span> Score Breakdown:
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {scoreKeys.map((key) => {
          const score = Rating[key] ?? Rating[key.replace(/([A-Z])/g, '_$1').toLowerCase()];
          const labelMap = {
            healthinessScore: '🥗 Healthiness',
            naturalIngredientsScore: '🍃 Natural Ingredients',
            additiveSafetyScore: '🚨 Additive Safety',
            sugarLevelScore: '🍬 Sugar Level',
            dietFriendlyScore: '🥦 Diet Friendly',
            childFriendlyScore: '👶 Child Friendly',
          };
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="w-36 font-medium flex items-center gap-1">{labelMap[key]}</span>
              <div className="flex-1 h-3 rounded bg-gray-200 overflow-hidden">
                <div className={`h-3 rounded ${getScoreBarColor(score)}`} style={{ width: `${score * 10}%` }}></div>
              </div>
              <span className={`ml-2 font-bold ${getScoreBarColor(score)}`}>{score !== undefined ? `${score}/10` : 'N/A'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScoreBreakdown;
