import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SummaryApi from '../common/index';
import { toast } from 'react-toastify';
import HealthierAlternatives from "../components/subcomponents/HealthierAlternatives";
import NutritionSummary from "../components/subcomponents/NutritionSummary";
import AIIngredientInsights from "../components/subcomponents/AIIngredientInsights";
import OriginalIngredients from "../components/subcomponents/OriginalIngredients";
import ScoreBreakdown from "../components/subcomponents/ScoreBreakdown";
import TopScorecardSummary from "../components/subcomponents/TopScorecardSummary";


export default function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [ingredientFilter, setIngredientFilter] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(SummaryApi.reportGet(id).url, { method: 'GET', credentials: 'include' });
        if (resp.status === 401) { navigate('/login'); return; }
        const data = await resp.json();
        if (data?.success) {
          setReport(data.data);
        } else {
          toast.error(data?.message || 'Not found');
        }
      } catch (e) {
        toast.error('Unable to fetch report');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const ai = report?.ai || {};
  const productName = report?.productName || 'Product';

  const scores = useMemo(() => {
    const Rating = ai.Rating || {};
    const scoreKeys = ['healthinessScore','naturalIngredientsScore','additiveSafetyScore','sugarLevelScore','dietFriendlyScore','childFriendlyScore'];
    const vals = scoreKeys.map(k => Rating[k] ?? Rating[k.replace(/([A-Z])/g, '_$1').toLowerCase()]);
    const valid = vals.filter(v => typeof v === 'number');
    const overall = valid.length ? Math.round(valid.reduce((a,b)=>a+b,0)/valid.length) : null;
    return { scoreKeys, overall };
  }, [ai]);

  const getRiskLevel = () => (ai.Verdict?.riskLevel || ai.Verdict?.overallSafety || 'Unknown');
  const getRiskColor = () => {
    const risk = getRiskLevel().toLowerCase();
    if (risk.includes('high')) return 'text-red-600';
    if (risk.includes('moderate')) return 'text-yellow-600';
    if (risk.includes('low') || risk.includes('safe')) return 'text-green-600';
    return 'text-gray-700';
  };
  const getScoreBarColor = (score) => score <=3 ? 'bg-red-500' : score<=7 ? 'bg-yellow-400' : 'bg-green-500';
  const getIngredientSeverity = (item) => {
    const status = (item.healthImpact?.status || '').toLowerCase();
    if (item.isConcern || status.includes('unhealthy') || status.includes('risk') || status.includes('danger')) return 'danger';
    if (status.includes('moderate') || status.includes('processed') || status.includes('neutral')) return 'warning';
    return 'safe';
  };

    

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#132a13]">Loading...</div>;
  if (!report) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-[#edf6e5] rounded-xl shadow-lg space-y-6 mt-10">
      <h2 className="text-3xl font-bold text-[#4f772d] text-center mb-2">{productName} Health Analysis</h2>
      <TopScorecardSummary productName={productName} overallScore={scores.overall} getScoreBarColor={getScoreBarColor} getRiskLevel={getRiskLevel} getRiskColor={getRiskColor} />
      <ScoreBreakdown scoreKeys={scores.scoreKeys} Rating={ai.Rating||{}} getScoreBarColor={getScoreBarColor} />

      {/* Verdict */}
      {ai.Verdict && (
        <div className={`rounded-xl shadow p-6 border ${getRiskColor()} mt-2 mb-2`}>
          <div className="text-lg font-semibold">{ai.Verdict.finalAdvice || ai.Verdict.recommendation}</div>
          <ul className="list-disc list-inside">
            {(ai.Verdict.friendlySummary || ai.Verdict.comments || []).map((point, i) => (<li key={i}>{point}</li>))}
          </ul>
        </div>
      )}

      <OriginalIngredients data={ai.Data||[]} ingredientFilter={ingredientFilter} setIngredientFilter={setIngredientFilter} getIngredientSeverity={getIngredientSeverity} />
      <AIIngredientInsights insights={(ai.IngredientInsights)||[]} />
      <NutritionSummary summary={ai.NutritionFactsSummary||{}} />
      <HealthierAlternatives alternatives={ai.alternatives||[]} />

      </div>
  
  );
}
