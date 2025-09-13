import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common';

export default function History() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`${SummaryApi.reportsList.url}?page=1&limit=20`, {
          method: SummaryApi.reportsList.method,
          credentials: 'include',
        });
        if (resp.status === 401) {
          navigate('/login');
          return;
        }
        const data = await resp.json();
        if (data?.success) setItems(data.data.items || []);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#132a13]">Loading...</div>;

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-[#4f772d] mb-4">History</h2>
      {items.length === 0 ? (
        <div className="text-gray-600">No reports yet. Scan a product to get started.</div>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it._id || it.id} className="bg-[#dde5b6] p-4 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#132a13]">{it.productName || 'Product'}</div>
                <div className="text-sm text-gray-600">{new Date(it.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/report/${it._id || it.id}`)}
                  className="bg-gradient-to-br from-[#b5e48c] to-[#73a942] cursor-pointer text-[#132a13] px-4 py-2 rounded-lg"
                >
                  View
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
