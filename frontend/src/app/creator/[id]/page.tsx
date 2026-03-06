'use client';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Link from 'next/link';
import VideoCard from '@/components/video/VideoCard';

interface CreatorProfileProps {
  params: {
    id: string;
  };
}

export default function CreatorProfile({ params }: CreatorProfileProps) {
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState<'videos' | 'about' | 'social'>('videos');

  // Mock creator data - in real app this would come from API
  const creator = {
    id: params.id,
    name: 'Priya Soren',
    bio: 'Traditional Santhal storyteller and cultural preservationist from Jharkhand. Dedicated to keeping Santhal traditions alive through digital storytelling.',
    avatar: '/avatars/priya.jpg',
    location: 'Ranchi, Jharkhand',
    joinDate: 'January 2023',
    followers: 1250,
    videos: 45,
    totalViews: 25000,
    socialLinks: {
      youtube: 'https://youtube.com/@priyasoren',
      instagram: 'https://instagram.com/priya_santhal',
      twitter: 'https://twitter.com/priyasoren'
    },
    languages: ['Santhali', 'Hindi', 'English'],
    specialties: ['Folk Stories', 'Traditional Dance', 'Cultural Education']
  };

  // Mock videos data
  const creatorVideos = [
    {
      id: '1',
      title: 'The Legend of the Seven Sisters',
      thumbnail: '/thumbnails/story1.jpg',
      description: 'Ancient Santhal creation story about the origin of humanity',
      views: 1250,
      uploadDate: '2 days ago'
    },
    {
      id: '2',
      title: 'Traditional Sohrae Dance',
      thumbnail: '/thumbnails/dance1.jpg',
      description: 'Harvest festival dance performance with traditional music',
      views: 890,
      uploadDate: '1 week ago'
    },
    {
      id: '3',
      title: 'Learning Ol Chiki Script',
      thumbnail: '/thumbnails/education1.jpg',
      description: 'Beginner\'s guide to reading and writing Santhali script',
      views: 2100,
      uploadDate: '2 weeks ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Creator Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-6xl">
              👩‍🎤
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold mb-2">{creator.name}</h1>
              <p className="text-orange-100 mb-4">{creator.bio}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span>📍 {creator.location}</span>
                <span>📅 Joined {creator.joinDate}</span>
                <span>👥 {creator.followers.toLocaleString()} followers</span>
                <span>🎬 {creator.videos} videos</span>
                <span>👁️ {creator.totalViews.toLocaleString()} views</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                Follow
              </button>
              <button className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'videos', label: 'Videos', icon: '🎬' },
              { id: 'about', label: 'About', icon: 'ℹ️' },
              { id: 'social', label: 'Social Links', icon: '🔗' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'videos' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Creator's Videos
              </h2>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>All Categories</option>
                  <option>Folk Songs</option>
                  <option>Dance</option>
                  <option>Stories</option>
                  <option>Education</option>
                  <option>News</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {creatorVideos.map((video) => (
                <div key={video.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{video.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{video.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span>👁️ {video.views.toLocaleString()} views</span>
                      <span>{video.uploadDate}</span>
                    </div>
                    <Link
                      href={`/watch/${video.id}`}
                      className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 w-full block text-center"
                    >
                      Watch Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About {creator.name}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Bio</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {creator.bio} With over 15 years of experience in cultural preservation,
                    I work to ensure that Santhal traditions, stories, and art forms are passed
                    down to future generations through modern digital platforms.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {creator.languages.map((lang) => (
                      <span key={lang} className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {creator.specialties.map((specialty) => (
                      <span key={specialty} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Community Impact</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-300">Videos Created</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{creator.videos}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-300">Total Views</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{creator.totalViews.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-300">Community Followers</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{creator.followers.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Recognition</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Cultural Preservation Award 2023
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Featured in National Museum Exhibition
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Community Education Initiative Lead
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Connect with {creator.name}</h2>

            <div className="space-y-4">
              <a
                href={creator.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">▶️</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">YouTube Channel</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Watch exclusive content and live performances</p>
                </div>
                <span className="text-red-500">→</span>
              </a>

              <a
                href={creator.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
              >
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">📷</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Instagram</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Behind-the-scenes and cultural photography</p>
                </div>
                <span className="text-pink-500">→</span>
              </a>

              <a
                href={creator.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🐦</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Twitter</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Latest updates and community discussions</p>
                </div>
                <span className="text-blue-500">→</span>
              </a>
            </div>

            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h3>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p>📧 priya.soren@santhalcommunity.org</p>
                <p>📱 Available for collaborations and cultural events</p>
                <p>🏠 Based in Ranchi, Jharkhand</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}