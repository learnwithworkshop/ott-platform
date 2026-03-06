'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SubtitleUploadProps {
  onSubtitleUpload: (language: string, file: File) => void;
  existingSubtitles?: {
    santhali?: string;
    hindi?: string;
    english?: string;
  };
}

export default function SubtitleUpload({ onSubtitleUpload, existingSubtitles }: SubtitleUploadProps) {
  const { t } = useTranslation('common');
  const [uploadedFiles, setUploadedFiles] = useState<{
    santhali?: File;
    hindi?: File;
    english?: File;
  }>({});

  const languages = [
    { key: 'santhali', label: 'Santhali (ᱥᱟᱱᱛᱟᱞᱤ)', flag: '🇮🇳' },
    { key: 'hindi', label: 'Hindi (हिंदी)', flag: '🇮🇳' },
    { key: 'english', label: 'English', flag: '🇺🇸' }
  ];

  const handleFileChange = (language: string, file: File | null) => {
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [language]: file }));
      onSubtitleUpload(language, file);
    } else {
      setUploadedFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[language as keyof typeof newFiles];
        return newFiles;
      });
    }
  };

  const removeFile = (language: string) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[language as keyof typeof newFiles];
      return newFiles;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📝</span>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Subtitle/Caption Support
        </h3>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
        Add subtitles in multiple languages to make your content accessible to a wider audience.
        Supported formats: .vtt, .srt
      </p>

      <div className="space-y-4">
        {languages.map((lang) => (
          <div key={lang.key} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {lang.label}
                </span>
              </div>
              {existingSubtitles?.[lang.key as keyof typeof existingSubtitles] && (
                <span className="text-green-600 dark:text-green-400 text-sm flex items-center gap-1">
                  ✓ Available
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".vtt,.srt"
                onChange={(e) => handleFileChange(lang.key, e.target.files?.[0] || null)}
                className="flex-1 text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-orange-50 file:text-orange-700
                  dark:file:bg-orange-900 dark:file:text-orange-200
                  hover:file:bg-orange-100 dark:hover:file:bg-orange-800"
              />

              {uploadedFiles[lang.key as keyof typeof uploadedFiles] && (
                <button
                  onClick={() => removeFile(lang.key)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2"
                  title="Remove file"
                >
                  ✕
                </button>
              )}
            </div>

            {uploadedFiles[lang.key as keyof typeof uploadedFiles] && (
              <div className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                <span>✓</span>
                {uploadedFiles[lang.key as keyof typeof uploadedFiles]?.name}
              </div>
            )}

            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Upload WebVTT (.vtt) or SubRip (.srt) files for best compatibility
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-blue-500 text-lg">ℹ️</span>
          <div>
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
              Subtitle Guidelines
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Ensure accurate timing and synchronization with video</li>
              <li>• Use clear, readable fonts and appropriate text size</li>
              <li>• Include cultural context and explanations where needed</li>
              <li>• Test subtitles across different devices and players</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}