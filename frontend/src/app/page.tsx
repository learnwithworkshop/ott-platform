'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import CategorySection from '@/components/video/CategorySection';
import VideoCard from '@/components/video/VideoCard';

export default function Home() {
  const { t } = useTranslation('common');

  // Featured cultural content (placeholder data)
  const featuredContent = [
    {
      id: '1',
      title: 'Traditional Santhal Dance Performance',
      thumbnail: '/thumbnails/dance.jpg',
      description: 'Beautiful traditional dance showcasing Santhal cultural heritage',
      category: 'dance'
    },
    {
      id: '2',
      title: 'Folk Songs of Jharkhand',
      thumbnail: '/thumbnails/folk-songs.jpg',
      description: 'Authentic folk songs passed down through generations',
      category: 'folk-songs'
    },
    {
      id: '3',
      title: 'Santhal Creation Stories',
      thumbnail: '/thumbnails/stories.jpg',
      description: 'Ancient stories that explain the Santhal worldview',
      category: 'stories'
    }
  ];

  // Upcoming events (placeholder data)
  const upcomingEvents = [
    {
      id: 'sohrae',
      title: 'Sohrae Festival Celebration',
      date: 'November 15, 2024',
      location: 'Jharkhand',
      description: 'Annual harvest festival with traditional ceremonies'
    },
    {
      id: 'karma',
      title: 'Karma Festival',
      date: 'October 20, 2024',
      location: 'West Bengal',
      description: 'Festival of flowers and traditional worship'
    },
    {
      id: 'baha',
      title: 'Baha Festival',
      date: 'December 5, 2024',
      location: 'Odisha',
      description: 'Flower festival celebrating nature and community'
    }
  ];

  // Community news (placeholder data)
  const communityNews = [
    {
      id: '1',
      title: 'New Cultural Center Opens in Ranchi',
      excerpt: 'A dedicated space for Santhal cultural preservation and education',
      date: '2 days ago',
      category: 'news'
    },
    {
      id: '2',
      title: 'Santhal Language App Launch',
      excerpt: 'Digital tool to help preserve and learn the Ol Chiki script',
      date: '1 week ago',
      category: 'education'
    },
    {
      id: '3',
      title: 'Traditional Art Workshop Success',
      excerpt: 'Over 50 young artists participated in the cultural workshop',
      date: '2 weeks ago',
      category: 'education'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              ᱥᱟᱱᱛᱟᱞ ᱥᱟᱦᱮᱫ ᱨᱤ ᱥᱩᱱᱫᱚᱨ
            </h1>
            <p className="text-xl mb-8 text-orange-100 max-w-3xl mx-auto">
              Discover the rich cultural heritage of the Santhal community through authentic videos,
              stories, music, and traditions. ᱥᱟᱱᱛᱟᱞ ᱥᱟᱦᱮᱫ ᱨᱤ ᱡᱤᱱᱤᱥ ᱠᱟᱦᱤ, ᱥᱮᱞᱮᱫ, ᱱᱟᱪᱚᱸ ᱟᱨ ᱦᱚᱸ ᱥᱟᱨ।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/categories"
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Explore Categories
              </Link>
              <Link
                href="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
              >
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cultural Content */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🎭 Featured Cultural Content
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the most popular and culturally significant content from our community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredContent.map((content) => (
              <VideoCard
                key={content.id}
                id={content.id}
                title={content.title}
                thumbnail={content.thumbnail}
                description={content.description}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/videos"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              View All Content
            </Link>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              📅 Upcoming Events
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join us in celebrating traditional Santhal festivals and cultural events
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🎪</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {event.location}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {event.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    {event.date}
                  </span>
                  <button className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium">
                    Learn More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community News */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              📰 Community News
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stay updated with the latest news and developments in the Santhal community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {communityNews.map((news) => (
              <div key={news.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">
                    {news.category === 'news' ? '📰' : news.category === 'education' ? '🎓' : '🎭'}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {news.date}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {news.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {news.excerpt}
                </p>
                <button className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium">
                  Read More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cultural Categories */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🎭 Explore Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover content organized by traditional Santhal cultural categories
            </p>
          </div>
          <CategorySection view="grid" />
        </div>
      </div>

      {/* Regional Highlights */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🗺️ Regional Highlights
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore Santhal cultural content from different regions
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { region: 'Jharkhand', flag: '🇮🇳', count: '250+ videos' },
              { region: 'West Bengal', flag: '🇮🇳', count: '180+ videos' },
              { region: 'Odisha', flag: '🇮🇳', count: '120+ videos' },
              { region: 'Assam', flag: '🇮🇳', count: '90+ videos' }
            ].map((region) => (
              <div key={region.region} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  {region.flag}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {region.region}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {region.count}
                </p>
                <button className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm font-medium mt-2">
                  Explore →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}