import React, { useEffect, useState } from "react";
import HealthierAlternatives from "./subcomponents/HealthierAlternatives";
import NutritionSummary from "./subcomponents/NutritionSummary";
import AIIngredientInsights from "./subcomponents/AIIngredientInsights";
import OriginalIngredients from "./subcomponents/OriginalIngredients";
import ScoreBreakdown from "./subcomponents/ScoreBreakdown";
import TopScorecardSummary from "./subcomponents/TopScorecardSummary";
import { useLocation, useNavigate } from "react-router-dom";


const Result = () => {
  const navigate = useNavigate();
  const { state: data } = useLocation();
  console.log("I got the data\n", data);

  useEffect(() => {
    if (!data) navigate("/scan");
  }, [data, navigate]);

  if (!data) return null;

  // Support both top-level and nested keys for compatibility
  const productName = data.productName || "Product";
  // Ingredient filter state
  const [ingredientFilter, setIngredientFilter] = useState('all'); // 'all', 'danger', 'safe'

  // Helper to determine severity for each ingredient
  const getIngredientSeverity = (item) => {
    const status = (item.healthImpact?.status || '').toLowerCase();
    if (item.isConcern || status.includes('unhealthy') || status.includes('risk') || status.includes('danger')) return 'danger';
    if (status.includes('moderate') || status.includes('processed') || status.includes('neutral')) return 'warning';
    return 'safe';
  };
  const IngredientInsights =
    data.IngredientInsights ||
    data.ingredientInsights ||
    [];
  const Data = data.Data || [];
  const NutritionFactsSummary = data.NutritionFactsSummary || data.nutritionFactsSummary || {};
  const Rating = data.Rating || data.rating || {};
  const Verdict = data.Verdict || data.verdict || {};

  // Calculate overall health score (average of all scores)
  const scoreKeys = [
    'healthinessScore',
    'naturalIngredientsScore',
    'additiveSafetyScore',
    'sugarLevelScore',
    'dietFriendlyScore',
    'childFriendlyScore',
  ];
  const scores = scoreKeys.map(k => Rating[k] ?? Rating[k.replace(/([A-Z])/g, '_$1').toLowerCase()]);
  const validScores = scores.filter(s => typeof s === 'number');
  const overallScore = validScores.length ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : null;
  const getScoreBarColor = (score) => {
    if (score <= 3) return 'bg-red-500';
    if (score <= 7) return 'bg-yellow-400';
    return 'bg-green-500';
  };
  const getRiskLevel = () => Verdict.riskLevel || Verdict.overallSafety || 'Unknown';
  const getRiskColor = () => {
    const risk = getRiskLevel().toLowerCase();
    if (risk.includes('high')) return 'text-red-600';
    if (risk.includes('moderate')) return 'text-yellow-600';
    if (risk.includes('low') || risk.includes('safe')) return 'text-green-600';
    return 'text-gray-700';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-[#edf6e5] rounded-xl shadow-lg space-y-6 mt-10">
      <h2 className="text-3xl font-bold text-[#4f772d] text-center mb-2">
        {productName} Health Analysis
      </h2>
      {/* Top Scorecard Summary */}
      <TopScorecardSummary
        productName={productName}
        overallScore={overallScore}
        getScoreBarColor={getScoreBarColor}
        getRiskLevel={getRiskLevel}
        getRiskColor={getRiskColor}
      />
      {/* Score Breakdown */}
      <ScoreBreakdown scoreKeys={scoreKeys} Rating={Rating} getScoreBarColor={getScoreBarColor} />

      {/* Verdict Section - Emotional & Color-Matched */}
      {Verdict && (() => {
        const risk = getRiskLevel().toLowerCase();
        let border = 'border-red-600', bg = 'bg-red-50', text = 'text-red-700', icon = '🔴', badge = 'HIGH RISK', list = 'text-red-800', advice = 'text-[#b91c1c]', pulse = 'animate-pulse-slow';
        if (risk.includes('low') || risk.includes('safe')) {
          border = 'border-green-600';
          bg = 'bg-green-50';
          text = 'text-green-700';
          icon = '🟢';
          badge = 'LOW RISK';
          list = 'text-green-800';
          advice = 'text-green-900';
          pulse = '';
        } else if (risk.includes('moderate')) {
          border = 'border-yellow-400';
          bg = 'bg-yellow-50';
          text = 'text-yellow-700';
          icon = '🟡';
          badge = 'MODERATE RISK';
          list = 'text-yellow-800';
          advice = 'text-yellow-900';
          pulse = '';
        }
        return (
          <div className={`rounded-xl shadow p-6 border-4 ${border} ${bg} mt-2 mb-2 flex flex-col gap-3 ${pulse}`}>
            <div className="flex items-center gap-3 mb-1">
              <span className={`text-3xl ${pulse}`}>{icon === '�' ? '�🚨' : icon}</span>
              <span className={`text-2xl font-extrabold ${text}`}>Verdict: {getRiskLevel().toUpperCase()}</span>
              <span className={`text-3xl ${pulse}`}>{icon === '�' ? '�🚨' : icon}</span>
            </div>
            <div className={`text-lg font-bold flex items-center gap-2 ${text}`}>
              <span>{icon} {badge}</span>
            </div>
            <div className={`text-base font-semibold mb-1 ${advice}`}>
              {Verdict.finalAdvice || Verdict.recommendation}
            </div>
            <ul className={`list-disc list-inside font-medium mb-1 ${list}`}>
              {(Verdict.friendlySummary || Verdict.comments)?.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        );
      })()}

      {/* Original Ingredients (Parsed) Section with Filter and Severity */}
      <OriginalIngredients
        data={data.Data}
        ingredientFilter={ingredientFilter}
        setIngredientFilter={setIngredientFilter}
        getIngredientSeverity={getIngredientSeverity}
      />

      {/* AI Ingredient Insights Section */}
      <AIIngredientInsights insights={IngredientInsights} />

      {/* Nutrition Summary */}
      <NutritionSummary summary={NutritionFactsSummary} />

      {/* Healthier Alternatives Section */}
      <HealthierAlternatives alternatives={data.alternatives} />
    </div>
  );
};

export default Result;
