'use client';

import { useTranslation } from 'react-i18next';
import CategorySection from '@/components/video/CategorySection';
import { useState } from 'react';

export default function CategoriesPage() {
  const { t } = useTranslation('categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {t('categories', 'Categories')}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            ᱥᱟᱱᱛᱟᱞ ᱥᱟᱦᱮᱫ ᱨᱤ ᱥᱩᱱᱫᱚᱨ ᱡᱤᱱᱤᱥ ᱠᱟᱦᱤ, ᱥᱮᱞᱮᱫ, ᱱᱟᱪᱚᱸ ᱟᱨ ᱦᱚᱸ ᱥᱟᱨ।
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CategorySection view="featured" />
      </div>

      {/* Featured Category Content */}
      {selectedCategory && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t('recommended', 'Recommended For You')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder for video cards */}
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

      {/* Cultural Info Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 py-12 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🎭 Santhal Cultural Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                🎵 Folk Songs
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Traditional Santhal folk songs and music that preserve the rich musical heritage of the community. These songs tell stories of love, nature, and cultural traditions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                💃 Dance
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Traditional Santhal dance performances and tutorials showcasing the vibrant dance forms that are an integral part of Santhal celebrations and ceremonies.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                📖 Stories
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Folk tales, legends, and cultural stories passed down through generations. These narratives preserve Santhal history, mythology, and moral teachings.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                🎓 Education
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Educational content about Santhal culture, history, language, and traditions. Learn about the Santhal way of life and their significant contributions to society.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                📰 News
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Latest news and updates from Santhal communities. Coverage includes cultural events, social initiatives, and important announcements affecting the community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
