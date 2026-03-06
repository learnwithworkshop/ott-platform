'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ReportedContent {
  id: string;
  type: 'video' | 'comment' | 'user';
  content: string;
  author: string;
  reason: string;
  reportedBy: string;
  reportDate: Date;
  status: 'pending' | 'reviewed' | 'resolved';
  severity: 'low' | 'medium' | 'high';
}

interface ModerationPanelProps {
  isModerator?: boolean;
}

const SAMPLE_REPORTS: ReportedContent[] = [
  {
    id: '1',
    type: 'comment',
    content: 'This content violates community guidelines with inappropriate language.',
    author: 'User123',
    reason: 'Harassment',
    reportedBy: 'CommunityMember',
    reportDate: new Date('2024-01-15T14:30:00'),
    status: 'pending',
    severity: 'medium'
  },
  {
    id: '2',
    type: 'video',
    content: 'Cultural misappropriation in traditional dance video.',
    author: 'ContentCreator',
    reason: 'Cultural Insensitivity',
    reportedBy: 'CulturalExpert',
    reportDate: new Date('2024-01-14T09:15:00'),
    status: 'pending',
    severity: 'high'
  },
  {
    id: '3',
    type: 'comment',
    content: 'Spam comment with irrelevant links.',
    author: 'SpamBot',
    reason: 'Spam',
    reportedBy: 'RegularUser',
    reportDate: new Date('2024-01-13T16:45:00'),
    status: 'reviewed',
    severity: 'low'
  }
];

const COMMUNITY_GUIDELINES = [
  {
    title: 'Cultural Respect',
    description: 'Respect Santhal culture, traditions, and community members. Avoid cultural misappropriation.',
    icon: '🎭'
  },
  {
    title: 'Appropriate Content',
    description: 'No hate speech, harassment, or inappropriate content. Keep discussions respectful.',
    icon: '🤝'
  },
  {
    title: 'Authenticity',
    description: 'Share authentic cultural content. Misinformation about Santhal culture is not allowed.',
    icon: '✅'
  },
  {
    title: 'Language Respect',
    description: 'Use Santhali, Hindi, or English appropriately. Respect linguistic diversity.',
    icon: '🗣️'
  },
  {
    title: 'Community Safety',
    description: 'Protect community privacy and safety. No doxxing or harmful content.',
    icon: '🛡️'
  }
];

export default function ModerationPanel({ isModerator = true }: ModerationPanelProps) {
  const { t } = useTranslation('common');
  const [reports, setReports] = useState<ReportedContent[]>(SAMPLE_REPORTS);
  const [selectedReport, setSelectedReport] = useState<ReportedContent | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reviewed' | 'resolved'>('all');
  const [moderationAction, setModerationAction] = useState('');

  const filteredReports = reports.filter(report =>
    filterStatus === 'all' || report.status === filterStatus
  );

  const handleModerationAction = (reportId: string, action: 'approve' | 'remove' | 'warn') => {
    setReports(prev => prev.map(report =>
      report.id === reportId
        ? { ...report, status: 'resolved' as const }
        : report
    ));
    setSelectedReport(null);
    setModerationAction('');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900';
      case 'medium': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900';
      case 'low': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900';
      case 'reviewed': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900';
      case 'resolved': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900';
    }
  };

  if (!isModerator) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Access Restricted
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          You need moderator privileges to access this panel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Community Guidelines */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          📋 Community Guidelines
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMMUNITY_GUIDELINES.map((guideline, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{guideline.icon}</span>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {guideline.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {guideline.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Moderation Dashboard */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              ⚖️ Content Moderation
            </h2>

            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">All Reports</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {reports.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Pending</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {reports.filter(r => r.status === 'reviewed').length}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Reviewed</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {reports.filter(r => r.status === 'resolved').length}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Resolved</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {reports.filter(r => r.severity === 'high' && r.status === 'pending').length}
              </div>
              <div className="text-sm text-red-600 dark:text-red-400">High Priority</div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getSeverityColor(report.severity)}`}>
                      {report.severity.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(report.status)}`}>
                      {report.status.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {report.type}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {report.reason}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    Reported by: {report.reportedBy} • {report.reportDate.toLocaleDateString()}
                  </p>

                  <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                    {report.content}
                  </p>
                </div>

                <div className="ml-4 text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    by {report.author}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Moderation Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Review Report
                </h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reported Content
                  </label>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-gray-900 dark:text-white">{selectedReport.content}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Author
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedReport.author}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reported By
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedReport.reportedBy}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reason
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedReport.reason}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Moderation Action
                  </label>
                  <textarea
                    value={moderationAction}
                    onChange={(e) => setModerationAction(e.target.value)}
                    placeholder="Add notes about your moderation decision..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleModerationAction(selectedReport.id, 'approve')}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium"
                >
                  ✅ Approve Content
                </button>
                <button
                  onClick={() => handleModerationAction(selectedReport.id, 'warn')}
                  className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 font-medium"
                >
                  ⚠️ Issue Warning
                </button>
                <button
                  onClick={() => handleModerationAction(selectedReport.id, 'remove')}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 font-medium"
                >
                  🚫 Remove Content
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}