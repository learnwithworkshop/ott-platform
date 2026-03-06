'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

interface EventCalendarProps {
  view?: 'upcoming' | 'calendar' | 'featured';
}

const TRADITIONAL_EVENTS = [
  {
    id: 'sohrae',
    name: 'Sohrae Festival',
    nameSanthali: 'ᱥᱚᱦᱨᱟᱭ',
    date: 'November 15, 2024',
    description: 'Harvest festival celebrating the rice crop with traditional ceremonies, dances, and community feasts.',
    significance: 'Marks the end of the harvesting season and thanksgiving for a bountiful crop',
    videos: [
      { id: '1', title: 'Sohrae Dance Performance', thumbnail: '/thumbnails/sohrae-dance.jpg' },
      { id: '2', title: 'Traditional Sohrae Rituals', thumbnail: '/thumbnails/sohrae-ritual.jpg' },
      { id: '3', title: 'Sohrae Folk Songs', thumbnail: '/thumbnails/sohrae-songs.jpg' }
    ],
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'karma',
    name: 'Karma Festival',
    nameSanthali: 'ᱠᱟᱨᱢᱟ',
    date: 'October 20, 2024',
    description: 'Festival of flowers and worship, celebrating the beauty of nature and community harmony.',
    significance: 'Celebrates the blooming of flowers and the beauty of creation',
    videos: [
      { id: '4', title: 'Karma Flower Decorations', thumbnail: '/thumbnails/karma-flowers.jpg' },
      { id: '5', title: 'Traditional Karma Music', thumbnail: '/thumbnails/karma-music.jpg' }
    ],
    color: 'from-pink-500 to-purple-500'
  },
  {
    id: 'baha',
    name: 'Baha Festival',
    nameSanthali: 'ᱵᱟᱦᱟ',
    date: 'December 5, 2024',
    description: 'Flower festival honoring nature and the environment with community gatherings and traditional performances.',
    significance: 'Honors the natural world and promotes environmental consciousness',
    videos: [
      { id: '6', title: 'Baha Traditional Dance', thumbnail: '/thumbnails/baha-dance.jpg' },
      { id: '7', title: 'Nature Worship Rituals', thumbnail: '/thumbnails/baha-ritual.jpg' }
    ],
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'sakrat',
    name: 'Sakrat Festival',
    nameSanthali: 'ᱥᱟᱠᱨᱟᱛ',
    date: 'January 14, 2025',
    description: 'Festival celebrating the harvest of winter crops with community feasts and cultural performances.',
    significance: 'Marks the completion of winter harvesting and community bonding',
    videos: [
      { id: '8', title: 'Sakrat Community Feast', thumbnail: '/thumbnails/sakrat-feast.jpg' }
    ],
    color: 'from-blue-500 to-indigo-500'
  }
];

export default function EventCalendar({ view = 'upcoming' }: EventCalendarProps) {
  const { t } = useTranslation('common');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const upcomingEvents = TRADITIONAL_EVENTS.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    return eventDate >= today;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (view === 'featured') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          🎭 Traditional Events
        </h3>

        <div className="space-y-4">
          {upcomingEvents.slice(0, 3).map((event) => (
            <div key={event.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">{event.name}</h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">{event.date}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{event.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-orange-600 dark:text-orange-400">
                  {event.videos.length} related videos
                </span>
                <button
                  onClick={() => setSelectedEvent(event.id)}
                  className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm font-medium"
                >
                  View Videos →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            📅 Traditional Event Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover Santhal cultural festivals and events throughout the year.
            Each festival has its own unique traditions, dances, and stories.
          </p>
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {TRADITIONAL_EVENTS.map((event) => (
            <div
              key={event.id}
              className={`bg-gradient-to-br ${event.color} rounded-lg p-6 text-white relative overflow-hidden`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">{event.name}</h3>
                  <span className="text-lg opacity-90">{event.nameSanthali}</span>
                </div>

                <div className="mb-4">
                  <div className="text-lg font-semibold mb-2">{event.date}</div>
                  <p className="text-white/90 leading-relaxed">{event.description}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Cultural Significance:</h4>
                  <p className="text-white/90 text-sm">{event.significance}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-75">
                    {event.videos.length} featured videos
                  </span>
                  <button
                    onClick={() => setSelectedEvent(event.id)}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Explore Videos
                  </button>
                </div>
              </div>

              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <div className="w-full h-full bg-white rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Event Videos Modal/Section */}
        {selectedEvent && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {TRADITIONAL_EVENTS.find(e => e.id === selectedEvent)?.name} Videos
              </h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TRADITIONAL_EVENTS.find(e => e.id === selectedEvent)?.videos.map((video) => (
                <div key={video.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {video.title}
                    </h3>
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

        {/* Cultural Information */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 mt-12 pt-8">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              🎭 Santhal Festival Traditions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🌾</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Harvest Festivals</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Celebrating agricultural cycles and community thanksgiving
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🌸</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Nature Worship</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Honoring the natural world and environmental harmony
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💃</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Cultural Dance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Traditional performances and community celebrations
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎵</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Folk Music</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Traditional songs and musical performances
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}