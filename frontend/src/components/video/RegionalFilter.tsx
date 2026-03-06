'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RegionalFilterProps {
  selectedRegion: string | null;
  onRegionChange: (region: string | null) => void;
}

const REGIONS = [
  { id: 'jharkhand', name: 'Jharkhand', flag: '🇮🇳', count: '250+ videos' },
  { id: 'west-bengal', name: 'West Bengal', flag: '🇮🇳', count: '180+ videos' },
  { id: 'odisha', name: 'Odisha', flag: '🇮🇳', count: '120+ videos' },
  { id: 'assam', name: 'Assam', flag: '🇮🇳', count: '90+ videos' }
];

export default function RegionalFilter({ selectedRegion, onRegionChange }: RegionalFilterProps) {
  const { t } = useTranslation('common');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🗺️ Filter by Region
      </h3>

      <div className="space-y-3">
        <button
          onClick={() => onRegionChange(null)}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
            selectedRegion === null
              ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl mr-3">🌍</span>
              <span className="font-medium">All Regions</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              640+ videos
            </span>
          </div>
        </button>

        {REGIONS.map((region) => (
          <button
            key={region.id}
            onClick={() => onRegionChange(region.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              selectedRegion === region.id
                ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xl mr-3">{region.flag}</span>
                <span className="font-medium">{region.name}</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {region.count}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Discover authentic Santhal cultural content from different regions of India where the community thrives.
        </p>
      </div>
    </div>
  );
}