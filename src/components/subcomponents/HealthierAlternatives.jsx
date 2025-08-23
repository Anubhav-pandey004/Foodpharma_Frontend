import React from "react";

const HealthierAlternatives = ({ alternatives }) => {
  if (!Array.isArray(alternatives) || alternatives.length === 0) return null;
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold text-[#4f772d] mb-2">
        Healthier Alternatives
      </h3>
      <ul className="divide-y divide-gray-200">
        {alternatives.map((alt, i) => (
          <li key={i} className="py-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <span className="font-bold text-lg text-[#31572c]">{alt.brand}</span>
                {alt.sweetener && (
                  <span className="ml-2 text-sm text-gray-600">(Sweetener: <span className="font-medium">{alt.sweetener}</span>)</span>
                )}
                <ul className="list-disc list-inside ml-5 text-gray-700 text-sm mt-1">
                  {alt.features?.map((f, j) => (
                    <li key={j}>{f}</li>
                  ))}
                </ul>
              </div>
              {alt.amazonLink && (
                <a
                  href={alt.amazonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 md:mt-0 px-4 py-2 bg-[#4f772d] text-white rounded shadow hover:bg-[#31572c] transition"
                >
                  View on Amazon
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HealthierAlternatives;
