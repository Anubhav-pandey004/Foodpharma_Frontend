import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common/index';
import { toast } from 'react-toastify';

const CONDITIONS = [
  { key: 'diabetes', label: 'Diabetes' },
  { key: 'hypertension', label: 'Hypertension' },
  { key: 'chronicKidneyDisease', label: 'Chronic Kidney Disease' },
  { key: 'heartDisease', label: 'Heart Disease' },
  { key: 'pku', label: 'PKU' },
  { key: 'ibs', label: 'IBS' },
  { key: 'gout', label: 'Gout' },
];

const ALLERGENS = ['nuts','peanuts','tree-nuts','dairy','gluten','eggs','soy','shellfish','fish','sesame','wheat'];
const DIET_PATTERNS = [ { key: 'veg', label: 'Vegetarian' }, { key: 'non-veg', label: 'Non-Vegetarian' } ];
const RESTRICTIONS = ['low-sodium','keto'];

export default function HealthProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState({
    conditions: CONDITIONS.reduce((acc, c) => ({ ...acc, [c.key]: false }), {}),
    lactoseIntolerance: false,
    allergies: [],
    dietPattern: '',
    dietRestrictions: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(SummaryApi.healthProfileGet.url, {
          method: SummaryApi.healthProfileGet.method,
          credentials: 'include',
        });
        if (resp.status === 401) {
          toast.info('Please login to continue.');
          navigate('/login');
          return;
        }
        const data = await resp.json();
        if (data?.success) {
          const hp = data.data?.healthProfile || {};
          setState({
            conditions: { ...state.conditions, ...(hp.conditions || {}) },
            lactoseIntolerance: !!hp.lactoseIntolerance,
            allergies: Array.isArray(hp.allergies) ? hp.allergies : [],
            dietPattern: hp.dietPattern || '',
            dietRestrictions: Array.isArray(hp.dietRestrictions) ? hp.dietRestrictions : [],
          });
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCondition = (key) => {
    setState((prev) => ({
      ...prev,
      conditions: { ...prev.conditions, [key]: !prev.conditions[key] }
    }));
  };

  const toggleArrayItem = (field, value) => {
    setState((prev) => {
      const arr = new Set(prev[field] || []);
      if (arr.has(value)) arr.delete(value); else arr.add(value);
      return { ...prev, [field]: Array.from(arr) };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!state.dietPattern) {
      toast.error('Please select a diet type.');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        conditions: state.conditions,
        lactoseIntolerance: state.lactoseIntolerance,
        allergies: state.allergies,
        dietPattern: state.dietPattern,
        dietRestrictions: state.dietRestrictions,
      };
      const resp = await fetch(SummaryApi.healthProfileUpdate.url, {
        method: SummaryApi.healthProfileUpdate.method,
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (data?.success) {
        toast.success('Health profile saved');
        navigate('/');
      } else {
        toast.error(data?.message || 'Unable to save');
      }
    } catch (e) {
      toast.error('Unable to save health profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white"><div className="text-[#132a13]">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="w-[95%] max-w-2xl p-8 space-y-6 bg-[#dde5b6] border-[1px] border-[#7a9f0c] shadow-2xl backdrop-blur-md rounded-lg text-[#132a13]">
        <h2 className="text-3xl font-semibold text-center">Health Profile</h2>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Conditions */}
          <div>
            <h3 className="font-semibold mb-2">Conditions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CONDITIONS.map((c) => (
                <label key={c.key} className="flex items-center gap-2">
                  <input type="checkbox" checked={!!state.conditions[c.key]} onChange={() => toggleCondition(c.key)} />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Lactose intolerance */}
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={state.lactoseIntolerance} onChange={(e) => setState((p) => ({ ...p, lactoseIntolerance: e.target.checked }))} />
              <span>Lactose intolerance</span>
            </label>
          </div>

          {/* Allergies */}
          <div>
            <h3 className="font-semibold mb-2">Allergies</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALLERGENS.map((a) => (
                <label key={a} className="flex items-center gap-2">
                  <input type="checkbox" checked={state.allergies.includes(a)} onChange={() => toggleArrayItem('allergies', a)} />
                  <span className="capitalize">{a.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Diet pattern */}
          <div>
            <h3 className="font-semibold mb-2">Diet type</h3>
            <div className="flex gap-4">
              {DIET_PATTERNS.map((d) => (
                <label key={d.key} className="flex items-center gap-2">
                  <input type="radio" name="dietPattern" value={d.key} checked={state.dietPattern === d.key} onChange={(e) => setState((p) => ({ ...p, dietPattern: e.target.value }))} />
                  <span>{d.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Restrictions */}
          <div>
            <h3 className="font-semibold mb-2">Dietary restrictions</h3>
            <div className="flex flex-wrap gap-4">
              {RESTRICTIONS.map((r) => (
                <label key={r} className="flex items-center gap-2">
                  <input type="checkbox" checked={state.dietRestrictions.includes(r)} onChange={() => toggleArrayItem('dietRestrictions', r)} />
                  <span className="capitalize">{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <button type="submit" disabled={saving} className="w-full bg-gradient-to-br from-[#b5e48c] to-[#73a942] cursor-pointer text-[#132a13] px-6 py-2 rounded-lg transition-all duration-200 font-medium disabled:opacity-60 disabled:cursor-not-allowed">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
