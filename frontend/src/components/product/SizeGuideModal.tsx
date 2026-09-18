'use client';

import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'men' | 'women' | 'kids';
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'men',
}) => {
  const [activeTab, setActiveTab] = useState<'men' | 'women' | 'kids'>(defaultTab);
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-zinc-950 border border-zinc-800 text-white w-full max-w-2xl rounded-none p-6 sm:p-8 shadow-2xl z-10 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <Ruler className="w-5 h-5 text-amber-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Ember Edge Size Guide</h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs & Unit Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-zinc-900 pb-4">
          <div className="flex space-x-2">
            {(['men', 'women', 'kids'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === tab
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1 bg-zinc-900 p-1 border border-zinc-800 text-xs">
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 font-mono uppercase ${unit === 'inches' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400'}`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 font-mono uppercase ${unit === 'cm' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400'}`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800 text-white uppercase font-mono">
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
            <tbody className="divide-y divide-zinc-900 font-mono">
              {sizeData[activeTab].map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="p-3 font-bold text-amber-400">{row.size}</td>
                  {'chest' in row && <td className="p-3">{row.chest}</td>}
                  {'bust' in row && <td className="p-3">{row.bust}</td>}
                  {'waist' in row && <td className="p-3">{row.waist}</td>}
                  {'shoulder' in row && <td className="p-3">{row.shoulder}</td>}
                  {'hips' in row && <td className="p-3">{row.hips}</td>}
                  {'height' in row && <td className="p-3">{row.height}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measurement Advice Box */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 text-xs text-zinc-400 space-y-1">
          <p className="font-semibold text-white uppercase">How to Measure:</p>
          <p>• <strong>Chest / Bust:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</p>
          <p>• <strong>Waist:</strong> Measure around your natural waistline, keeping tape comfortably loose.</p>
          <p>• <strong>Oversized Fits:</strong> Our oversized streetwear tops have a drop-shoulder cut. Order your true size for the intended relaxed drape.</p>
        </div>
      </div>
    </div>
  );
};
