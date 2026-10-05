'use client';

import React, { useState } from 'react';
import { Ruler } from 'lucide-react';

export default function StandaloneSizeGuidePage() {
  const [activeTab, setActiveTab] = useState<'men' | 'women' | 'kids'>('men');
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  const sizeData = {
    men: [
      { size: 'S', chest: unit === 'inches' ? '36 - 38' : '91 - 96', waist: unit === 'inches' ? '30 - 32' : '76 - 81', shoulder: unit === 'inches' ? '17.5' : '44.5' },
      { size: 'M', chest: unit === 'inches' ? '39 - 41' : '99 - 104', waist: unit === 'inches' ? '33 - 35' : '84 - 89', shoulder: unit === 'inches' ? '18.5' : '47.0' },
      { size: 'L', chest: unit === 'inches' ? '42 - 44' : '107 - 112', waist: unit === 'inches' ? '36 - 38' : '91 - 96', shoulder: unit === 'inches' ? '19.5' : '49.5' },
      { size: 'XL', chest: unit === 'inches' ? '45 - 47' : '114 - 119', waist: unit === 'inches' ? '39 - 41' : '99 - 104', shoulder: unit === 'inches' ? '20.5' : '52.0' },
    ],
    women: [
      { size: 'XS', bust: unit === 'inches' ? '31 - 33' : '79 - 84', waist: unit === 'inches' ? '24 - 25' : '61 - 64', hips: unit === 'inches' ? '34 - 35' : '86 - 89' },
      { size: 'S', bust: unit === 'inches' ? '34 - 35' : '86 - 89', waist: unit === 'inches' ? '26 - 27' : '66 - 69', hips: unit === 'inches' ? '36 - 37' : '91 - 94' },
      { size: 'M', bust: unit === 'inches' ? '36 - 37' : '91 - 94', waist: unit === 'inches' ? '28 - 29' : '71 - 74', hips: unit === 'inches' ? '38 - 39' : '96 - 99' },
      { size: 'L', bust: unit === 'inches' ? '38 - 40' : '96 - 101', waist: unit === 'inches' ? '30 - 32' : '76 - 81', hips: unit === 'inches' ? '40 - 42' : '101 - 106' },
    ],
    kids: [
      { size: '4Y', height: unit === 'inches' ? '39 - 42' : '100 - 107', chest: unit === 'inches' ? '22 - 23' : '56 - 58' },
      { size: '6Y', height: unit === 'inches' ? '43 - 46' : '109 - 117', chest: unit === 'inches' ? '24 - 25' : '61 - 64' },
      { size: '8Y', height: unit === 'inches' ? '47 - 51' : '119 - 130', chest: unit === 'inches' ? '26 - 27' : '66 - 69' },
      { size: '10Y', height: unit === 'inches' ? '52 - 56' : '132 - 142', chest: unit === 'inches' ? '28 - 29' : '71 - 74' },
      { size: '12Y', height: unit === 'inches' ? '57 - 61' : '145 - 155', chest: unit === 'inches' ? '30 - 31' : '76 - 79' },
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-8 text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#e58a2b]">FITMENT GUIDANCE</span>
        <h1 className="text-3xl font-black uppercase text-[#1c1c1c] font-serif">Master Size Guide</h1>
        <p className="text-xs text-[#5f5f5d] max-w-md mx-auto">
          Ensure your Ember Edge silhouette fits with precision. Use our body measurement tables below.
        </p>
      </div>

      <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eceae4] pb-4">
          <div className="flex space-x-2">
            {(['men', 'women', 'kids'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-colors ${
                  activeTab === tab ? 'bg-[#1c1c1c] text-[#fcfbf8]' : 'bg-[#5f5f5d]/10 text-[#5f5f5d] hover:text-[#1c1c1c]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1 bg-[#5f5f5d]/10 p-1 rounded-full border border-[#eceae4] text-xs">
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 font-mono uppercase rounded-full transition-colors ${unit === 'inches' ? 'bg-[#1c1c1c] text-[#fcfbf8] font-bold' : 'text-[#5f5f5d]'}`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 font-mono uppercase rounded-full transition-colors ${unit === 'cm' ? 'bg-[#1c1c1c] text-[#fcfbf8] font-bold' : 'text-[#5f5f5d]'}`}
            >
              CM
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1c1c1c]">
            <thead>
              <tr className="bg-[#eceae4]/60 border-b border-[#eceae4] text-[#1c1c1c] uppercase font-mono">
                <th className="p-3">Size</th>
                {activeTab === 'men' && (
                  <>
                    <th className="p-3">Chest ({unit})</th>
                    <th className="p-3">Waist ({unit})</th>
                    <th className="p-3">Shoulder ({unit})</th>
                  </>
                )}
                {activeTab === 'women' && (
                  <>
                    <th className="p-3">Bust ({unit})</th>
                    <th className="p-3">Waist ({unit})</th>
                    <th className="p-3">Hips ({unit})</th>
                  </>
                )}
                {activeTab === 'kids' && (
                  <>
                    <th className="p-3">Height ({unit})</th>
                    <th className="p-3">Chest ({unit})</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceae4] font-mono">
              {sizeData[activeTab].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#5f5f5d]/5 transition-colors">
                  <td className="p-3 font-bold text-[#e58a2b]">{row.size}</td>
                  {'chest' in row && <td className="p-3 text-[#5f5f5d]">{row.chest}</td>}
                  {'bust' in row && <td className="p-3 text-[#5f5f5d]">{row.bust}</td>}
                  {'waist' in row && <td className="p-3 text-[#5f5f5d]">{row.waist}</td>}
                  {'shoulder' in row && <td className="p-3 text-[#5f5f5d]">{row.shoulder}</td>}
                  {'hips' in row && <td className="p-3 text-[#5f5f5d]">{row.hips}</td>}
                  {'height' in row && <td className="p-3 text-[#5f5f5d]">{row.height}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
