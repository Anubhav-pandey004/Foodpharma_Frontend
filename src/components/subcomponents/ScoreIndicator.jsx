import React from "react";

const getScoreColor = (score) => {
  if (score <= 3) return "#ef4444"; // red-500
  if (score <= 7) return "#facc15"; // yellow-400
  return "#22c55e"; // green-500
};

const ScoreIndicator = ({ label, score }) => {
  // Calculate stroke-dasharray for partial coloring
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.max(0, Math.min(score / 10, 1));
  const dash = percent * circumference;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-20 h-20" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          {/* Foreground arc (partial, colored by score) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={getScoreColor(score)}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          {/* Score in the center */}
          <text
            x="50"
            y="54"
            textAnchor="middle"
            fill="#222"
            fontWeight="bold"
            fontSize="20"
            dominantBaseline="middle"
          >
            {score}/10
          </text>
        </svg>
      </div>
      <p className="mt-2 text-sm text-gray-700 font-semibold">{label}</p>
    </div>
  );
};

export default ScoreIndicator;
