'use client';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  nameKey: string;
  descKey: string;
  icon: string;
  color: string;
}

const SANTHAL_CATEGORIES: Category[] = [
  {
    id: 'folk-songs',
    nameKey: 'folkSongs',
    descKey: 'folkSongsDesc',
    icon: '🎵',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'dance',
    nameKey: 'dance',
    descKey: 'danceDesc',
    icon: '💃',
    color: 'from-pink-500 to-red-500',
  },
  {
    id: 'stories',
    nameKey: 'stories',
    descKey: 'storiesDesc',
    icon: '📖',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'education',
    nameKey: 'education',
    descKey: 'educationDesc',
    icon: '🎓',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'news',
    nameKey: 'news',
    descKey: 'newsDesc',
    icon: '📰',
    color: 'from-orange-500 to-amber-500',
  },
];

interface CategoryViewProps {
  view?: 'grid' | 'featured' | 'minimal';
  limit?: number;
  showAllLink?: boolean;
}

export default function CategorySection({
  view = 'grid',
  limit,
  showAllLink = true,
}: CategoryViewProps) {
  const { t } = useTranslation('categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const displayCategories = limit
    ? SANTHAL_CATEGORIES.slice(0, limit)
    : SANTHAL_CATEGORIES;

  if (view === 'featured') {
    return (
      <section className="py-12 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {t('categories', 'Categories')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              ᱥᱟᱱᱛᱟᱞ ᱥᱟᱦᱮᱫ ᱟᱨ ᱦᱸᱠᱩᱥ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group"
              >
                <div
                  className={`bg-gradient-to-br ${category.color} p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer h-full`}
                >
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className="text-white text-xl font-bold mb-2">
                    {t(category.nameKey)}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {t(category.descKey)}
                  </p>
                  <div className="mt-4 flex items-center text-white text-sm font-semibold">
                    {t('exploreMore', 'Explore More')}
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {showAllLink && limit && (
            <div className="text-center mt-10">
              <Link
                href="/categories"
                className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                {t('allCategories', 'All Categories')}
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (view === 'minimal') {
    return (
      <div className="flex flex-wrap gap-2">
        {displayCategories.map((category) => (
          <Link key={category.id} href={`/categories/${category.id}`}>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full text-sm font-medium transition-colors flex items-center gap-2">
              <span>{category.icon}</span>
              {t(category.nameKey)}
            </button>
          </Link>
        ))}
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {displayCategories.map((category) => (
        <Link key={category.id} href={`/categories/${category.id}`}>
          <div
            onMouseEnter={() => setSelectedCategory(category.id)}
            onMouseLeave={() => setSelectedCategory(null)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-4 cursor-pointer border border-gray-200 dark:border-gray-700"
          >
            <div className="text-4xl mb-3">{category.icon}</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {t(category.nameKey)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {t(category.descKey)}
            </p>
            {selectedCategory === category.id && (
              <div className="mt-3 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                {t('viewAll', 'View All')}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
