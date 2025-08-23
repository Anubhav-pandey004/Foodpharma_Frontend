import React from "react";

const OriginalIngredients = ({ data, ingredientFilter, setIngredientFilter, getIngredientSeverity }) => {
  if (!Array.isArray(data) || data.length === 0) return null;
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold text-[#4f772d] mb-2">
        Original Ingredients (Parsed)
      </h3>
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded font-semibold border-2 flex items-center gap-1 ${ingredientFilter === 'danger' ? 'bg-red-600 text-white border-red-600' : 'bg-white border-red-300 text-red-600 hover:bg-red-50'}`}
          onClick={() => setIngredientFilter('danger')}
        >
          🔴 Show Harmful
        </button>
        <button
          className={`px-3 py-1 rounded font-semibold border-2 flex items-center gap-1 ${ingredientFilter === 'all' ? 'bg-yellow-400 text-white border-yellow-400' : 'bg-white border-yellow-300 text-yellow-700 hover:bg-yellow-50'}`}
          onClick={() => setIngredientFilter('all')}
        >
          🟡 Show All
        </button>
        <button
          className={`px-3 py-1 rounded font-semibold border-2 flex items-center gap-1 ${ingredientFilter === 'safe' ? 'bg-green-600 text-white border-green-600' : 'bg-white border-green-300 text-green-700 hover:bg-green-50'}`}
          onClick={() => setIngredientFilter('safe')}
        >
          🟢 Show Safe Only
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.filter(item => {
          const sev = getIngredientSeverity(item);
          if (ingredientFilter === 'all') return true;
          if (ingredientFilter === 'danger') return sev === 'danger';
          if (ingredientFilter === 'safe') return sev === 'safe';
          return true;
        }).map((item, i) => {
          const sev = getIngredientSeverity(item);
          let border = 'border-green-500';
          let bg = 'bg-green-50';
          let icon = '🟢';
          if (sev === 'danger') {
            border = 'border-red-600';
            bg = 'bg-red-50';
            icon = '🔴';
          } else if (sev === 'warning') {
            border = 'border-yellow-400';
            bg = 'bg-yellow-50';
            icon = '🟡';
          }
          return (
            <div key={i} className={`border-l-8 ${border} ${bg} rounded-lg p-4 flex flex-col gap-1 shadow-sm card--${sev}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{icon}</span>
                <span className="font-bold text-gray-800 text-lg">{item.ingredient}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded ml-2 ${item.isConcern ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{item.isConcern ? 'Concern' : 'OK'}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-700 mb-1">
                <span>Type: <span className="font-medium">{item.type}</span></span>
                {item.processingLevel && <span>Processing: <span className="font-medium">{item.processingLevel}</span></span>}
                {item.healthImpact?.status && <span>Status: <span className="font-medium">{item.healthImpact.status}</span></span>}
                {item.allergenInfo?.isCommonAllergen && <span className="text-red-600">Allergen</span>}
                {item.additiveInfo?.isAdditive && <span className="text-yellow-700">Additive</span>}
                {item.dietCompatibility && (
                  <span>
                    Diet: {Object.entries(item.dietCompatibility).filter(([k,v]) => v).map(([k]) => k.replace(/([A-Z])/g, ' $1').trim()).join(', ')}
                  </span>
                )}
                {item.regulatoryStatus?.fdaApproved === false && <span className="text-red-700">Not FDA Approved</span>}
                {item.regulatoryStatus?.restrictedCountries?.length > 0 && (
                  <span className="text-orange-700">Restricted: {item.regulatoryStatus.restrictedCountries.join(', ')}</span>
                )}
              </div>
              {/* Join multi-line benefits/risks into single sentences for clarity */}
              {item.healthImpact?.benefits?.length > 0 && (
                <ul className="list-disc list-inside ml-5 text-green-700 text-xs mt-1">
                  {item.healthImpact.benefits
                    .join(' ')
                    .split(/(?<=\.)\s+/)
                    .filter(Boolean)
                    .map((b, j) => (
                      <li key={j}>Benefit: {b.trim()}</li>
                    ))}
                </ul>
              )}
              {item.healthImpact?.risks?.length > 0 && (
                <ul className="list-disc list-inside ml-5 text-red-600 text-xs mt-1">
                  {item.healthImpact.risks
                    .join(' ')
                    .split(/(?<=\.)\s+/)
                    .filter(Boolean)
                    .map((r, j) => (
                      <li key={j}>Risk: {r.trim()}</li>
                    ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OriginalIngredients;
