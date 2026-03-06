'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DownloadedVideo {
  id: string;
  title: string;
  thumbnail: string;
  downloadDate: Date;
  expiryDate: Date;
  fileSize: string;
  quality: string;
  progress: number; // 0-100
  status: 'downloading' | 'completed' | 'expired' | 'failed';
}

interface OfflineViewingProps {
  isPremiumUser?: boolean;
}

const SAMPLE_DOWNLOADED_VIDEOS: DownloadedVideo[] = [
  {
    id: '1',
    title: 'Traditional Santhal Dance Performance',
    thumbnail: '/thumbnails/dance.jpg',
    downloadDate: new Date('2024-01-10T10:00:00'),
    expiryDate: new Date('2024-01-17T10:00:00'), // 7 days from download
    fileSize: '245 MB',
    quality: '720p',
    progress: 100,
    status: 'completed'
  },
  {
    id: '2',
    title: 'Sohrae Festival Stories',
    thumbnail: '/thumbnails/sohrae.jpg',
    downloadDate: new Date('2024-01-12T14:30:00'),
    expiryDate: new Date('2024-01-19T14:30:00'),
    fileSize: '180 MB',
    quality: '720p',
    progress: 100,
    status: 'completed'
  },
  {
    id: '3',
    title: 'Learning Ol Chiki Script',
    thumbnail: '/thumbnails/ol-chiki.jpg',
    downloadDate: new Date('2024-01-15T09:00:00'),
    expiryDate: new Date('2024-01-22T09:00:00'),
    fileSize: '320 MB',
    quality: '1080p',
    progress: 65,
    status: 'downloading'
  }
];

export default function OfflineViewing({ isPremiumUser = true }: OfflineViewingProps) {
  const { t } = useTranslation('common');
  const [downloadedVideos, setDownloadedVideos] = useState<DownloadedVideo[]>(SAMPLE_DOWNLOADED_VIDEOS);
  const [selectedQuality, setSelectedQuality] = useState<'480p' | '720p' | '1080p'>('720p');
  const [downloadQueue, setDownloadQueue] = useState<string[]>([]);

  const handleDownload = (videoId: string) => {
    if (!isPremiumUser) return;

    // Simulate download start
    setDownloadQueue(prev => [...prev, videoId]);
    setDownloadedVideos(prev => prev.map(video =>
      video.id === videoId
        ? { ...video, status: 'downloading' as const, progress: 0 }
        : video
    ));

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setDownloadedVideos(prev => prev.map(video =>
          video.id === videoId
            ? { ...video, status: 'completed' as const, progress: 100 }
            : video
        ));
        setDownloadQueue(prev => prev.filter(id => id !== videoId));
      } else {
        setDownloadedVideos(prev => prev.map(video =>
          video.id === videoId
            ? { ...video, progress: Math.round(progress) }
            : video
        ));
      }
    }, 500);
  };

  const handleDelete = (videoId: string) => {
    setDownloadedVideos(prev => prev.filter(video => video.id !== videoId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'downloading': return 'text-blue-600 dark:text-blue-400';
      case 'expired': return 'text-red-600 dark:text-red-400';
      case 'failed': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'downloading': return '⬇️';
      case 'expired': return '⏰';
      case 'failed': return '❌';
      default: return '📹';
    }
  };

  const formatExpiryTime = (expiryDate: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 0) return 'Expired';
    if (diffInHours < 24) return `${diffInHours}h left`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d left`;
  };

  if (!isPremiumUser) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-4">⭐</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Premium Feature
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
          Offline viewing is available for premium subscribers only. Download videos to watch without internet connection.
        </p>
        <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
          Upgrade to Premium
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              📱 Offline Viewing
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Download videos to watch offline. Available for premium users only.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Storage Used</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              745 MB / 2 GB
            </div>
          </div>
        </div>

        {/* Download Settings */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Download Quality:
            </label>
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="480p">480p (Smaller file)</option>
              <option value="720p">720p (HD Quality)</option>
              <option value="1080p">1080p (Full HD)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Download Queue */}
      {downloadQueue.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
            ⬇️ Download Queue
          </h3>
          <div className="space-y-2">
            {downloadQueue.map((videoId) => {
              const video = downloadedVideos.find(v => v.id === videoId);
              if (!video) return null;
              return (
                <div key={videoId} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {video.title}
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${video.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    {video.progress}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Downloaded Videos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            📹 Downloaded Videos ({downloadedVideos.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {downloadedVideos.map((video) => (
            <div key={video.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs">{getStatusIcon(video.status)}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {video.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>📅 {video.downloadDate.toLocaleDateString()}</span>
                    <span>💾 {video.fileSize}</span>
                    <span>🎬 {video.quality}</span>
                    <span className={getStatusColor(video.status)}>
                      {video.status === 'downloading' ? `${video.progress}%` : formatExpiryTime(video.expiryDate)}
                    </span>
                  </div>

                  {video.status === 'downloading' && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${video.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {video.status === 'completed' && (
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">
                      ▶️ Watch Offline
                    </button>
                  )}

                  {video.status === 'expired' && (
                    <button
                      onClick={() => handleDownload(video.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                    >
                      🔄 Re-download
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(video.id)}
                    className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {downloadedVideos.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Downloaded Videos
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start downloading videos to watch them offline. Browse our content library to find videos you love.
            </p>
            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
              Browse Content
            </button>
          </div>
        )}
      </div>

      {/* Premium Benefits */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="text-4xl">⭐</div>
          <div>
            <h3 className="text-lg font-bold mb-2">Premium Offline Benefits</h3>
            <ul className="text-orange-100 space-y-1">
              <li>• Download unlimited videos for offline viewing</li>
              <li>• HD quality downloads (up to 1080p)</li>
              <li>• Videos available offline for 7 days</li>
              <li>• No ads or interruptions</li>
              <li>• Priority download queue</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}