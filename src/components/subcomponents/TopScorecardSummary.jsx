import React from "react";

const TopScorecardSummary = ({ productName, overallScore, getScoreBarColor, getRiskLevel, getRiskColor }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-2 border-[#4f772d]">
      <div className="flex-1 flex flex-col gap-2">
        <div className="text-lg font-bold flex items-center gap-2">
          <span role="img" aria-label="product">📦</span> Product: <span className="text-[#31572c]">{productName}</span>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <span role="img" aria-label="brain">🧠</span>
            <span className="font-semibold">Overall Health Score:</span>
            <span className={`text-2xl font-bold ${getScoreBarColor(overallScore)}`}>{overallScore !== null ? `${overallScore}/10` : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span role="img" aria-label="risk">🚫</span>
            <span className="font-semibold">Risk:</span>
            <span className={`font-bold ${getRiskColor()}`}>{getRiskLevel()}</span>
          </div>
        </div>
      </div>
      {/* Radial meter for overall score */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <svg className="w-24 h-24" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" stroke="#e5e7eb" strokeWidth="8" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke={overallScore !== null ? (overallScore <= 3 ? '#ef4444' : overallScore <= 7 ? '#facc15' : '#22c55e') : '#d1d5db'}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${overallScore !== null ? (overallScore/10)*2*Math.PI*44 : 0} ${(1-(overallScore !== null ? overallScore/10 : 0))*2*Math.PI*44}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="54" textAnchor="middle" fill="#222" fontWeight="bold" fontSize="24" dominantBaseline="middle">
            {overallScore !== null ? `${overallScore}/10` : 'N/A'}
          </text>
        </svg>
        <span className="text-xs text-gray-500 mt-1">Overall Score</span>
      </div>
    </div>
  );
};

export default TopScorecardSummary;
