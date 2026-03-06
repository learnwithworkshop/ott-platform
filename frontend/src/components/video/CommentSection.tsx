'use client';

import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  language: 'santhali' | 'hindi' | 'english';
  timestamp: Date;
  likes: number;
  replies?: Comment[];
  isLiked?: boolean;
}

interface CommentSectionProps {
  videoId: string;
  totalComments?: number;
}

const SAMPLE_COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'Priya Soren',
    avatar: '👩‍🎤',
    content: 'ᱟᱨ ᱡᱷᱚᱛᱚ ᱥᱩᱱᱫᱚᱨ ᱜᱤᱛᱟᱹ ᱾ ᱱᱚᱶᱟ ᱜᱤᱛᱟᱹ ᱟᱹᱨ ᱥᱟᱱᱛᱟᱞ ᱥᱟᱦᱮᱫ ᱨᱤ ᱡᱤᱱᱤᱥ ᱠᱟᱦᱤ ᱠᱟᱱᱟ ᱾',
    language: 'santhali',
    timestamp: new Date('2024-01-15T10:30:00'),
    likes: 24,
    isLiked: false
  },
  {
    id: '2',
    author: 'Rajesh Kumar',
    avatar: '👨‍💼',
    content: 'बहुत सुंदर प्रस्तुति! संथाल संस्कृति की समृद्ध परंपराओं को इतनी खूबसूरती से दिखाना बहुत अच्छा लगा।',
    language: 'hindi',
    timestamp: new Date('2024-01-15T11:15:00'),
    likes: 18,
    isLiked: true,
    replies: [
      {
        id: '2-1',
        author: 'Maya Singh',
        avatar: '👩‍🎨',
        content: 'सही कहा! यह वीडियो आने वाली पीढ़ी के लिए बहुत महत्वपूर्ण है।',
        language: 'hindi',
        timestamp: new Date('2024-01-15T11:45:00'),
        likes: 8,
        isLiked: false
      }
    ]
  },
  {
    id: '3',
    author: 'John Smith',
    avatar: '👨‍🏫',
    content: 'Beautiful cultural preservation work. The attention to detail in the traditional costumes and music is remarkable.',
    language: 'english',
    timestamp: new Date('2024-01-15T12:00:00'),
    likes: 12,
    isLiked: false
  }
];

export default function CommentSection({ videoId, totalComments = 47 }: CommentSectionProps) {
  const { t } = useTranslation('common');
  const [comments, setComments] = useState<Comment[]>(SAMPLE_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'santhali' | 'hindi' | 'english'>('hindi');
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const languages = [
    { key: 'santhali', label: 'ᱥᱟᱱᱛᱟᱞᱤ', flag: '🇮🇳' },
    { key: 'hindi', label: 'हिंदी', flag: '🇮🇳' },
    { key: 'english', label: 'English', flag: '🇺🇸' }
  ];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You', // In real app, get from auth context
      avatar: '👤',
      content: newComment,
      language: selectedLanguage,
      timestamp: new Date(),
      likes: 0,
      isLiked: false
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const handleReplySubmit = (parentId: string) => {
    if (!replyText.trim()) return;

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      author: 'You',
      avatar: '👤',
      content: replyText,
      language: selectedLanguage,
      timestamp: new Date(),
      likes: 0,
      isLiked: false
    };

    setComments(prev => prev.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    }));

    setReplyText('');
    setShowReplyForm(null);
  };

  const toggleLike = (commentId: string, isReply = false, parentId?: string) => {
    setComments(prev => prev.map(comment => {
      if (isReply && parentId) {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies?.map(reply =>
              reply.id === commentId
                ? { ...reply, isLiked: !reply.isLiked, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1 }
                : reply
            )
          };
        }
      } else if (comment.id === commentId) {
        return { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 };
      }
      return comment;
    }));
  };

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      case 'popular':
        return b.likes - a.likes;
      case 'newest':
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            💬 Community Discussion
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({totalComments} comments)
            </span>
          </h3>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Liked</option>
          </select>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <div className="flex gap-2 mb-3">
            {languages.map((lang) => (
              <button
                key={lang.key}
                type="button"
                onClick={() => setSelectedLanguage(lang.key as any)}
                className={`px-3 py-1 text-sm rounded-lg flex items-center gap-1 ${
                  selectedLanguage === lang.key
                    ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>{lang.flag}</span>
                {lang.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg">👤</span>
            </div>
            <div className="flex-1">
              <textarea
                ref={commentInputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={
                  selectedLanguage === 'santhali'
                    ? 'ᱟᱢᱟᱜ ᱵᱤᱪᱟᱹᱨ ᱞᱤᱠᱷᱚᱭ ᱢᱮ... (Write your comment in Santhali...)'
                    : selectedLanguage === 'hindi'
                    ? 'अपनी टिप्पणी यहाँ लिखें... (Write your comment here...)'
                    : 'Write your comment here...'
                }
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                rows={3}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedLanguage === 'santhali' && 'ᱚᱞ ᱪᱤᱠᱤ ᱥᱨᱤᱯᱴ ᱨᱮ ᱞᱤᱠᱷᱟᱭ'}
                  {selectedLanguage === 'hindi' && 'हिंदी या अंग्रेजी में लिखें'}
                  {selectedLanguage === 'english' && 'Write in English'}
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {sortedComments.map((comment) => (
          <div key={comment.id} className="p-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">{comment.avatar}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {comment.author}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    comment.language === 'santhali'
                      ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                      : comment.language === 'hindi'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}>
                    {comment.language === 'santhali' && 'ᱥᱟᱱᱛᱟᱞᱤ'}
                    {comment.language === 'hindi' && 'हिंदी'}
                    {comment.language === 'english' && 'EN'}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatTimestamp(comment.timestamp)}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                  {comment.content}
                </p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(comment.id)}
                    className={`flex items-center gap-1 text-sm ${
                      comment.isLiked
                        ? 'text-red-500 dark:text-red-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <span>{comment.isLiked ? '❤️' : '🤍'}</span>
                    {comment.likes}
                  </button>

                  <button
                    onClick={() => setShowReplyForm(showReplyForm === comment.id ? null : comment.id)}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Reply
                  </button>
                </div>

                {/* Reply Form */}
                {showReplyForm === comment.id && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span>👤</span>
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          rows={2}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => {
                              setShowReplyForm(null);
                              setReplyText('');
                            }}
                            className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReplySubmit(comment.id)}
                            disabled={!replyText.trim()}
                            className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm">{reply.avatar}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                {reply.author}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTimestamp(reply.timestamp)}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                              {reply.content}
                            </p>
                            <button
                              onClick={() => toggleLike(reply.id, true, comment.id)}
                              className={`flex items-center gap-1 text-xs ${
                                reply.isLiked
                                  ? 'text-red-500 dark:text-red-400'
                                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                              }`}
                            >
                              <span>{reply.isLiked ? '❤️' : '🤍'}</span>
                              {reply.likes}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {comments.length > 0 && (
        <div className="p-6 text-center border-t border-gray-200 dark:border-gray-700">
          <button className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium">
            Load More Comments
          </button>
        </div>
      )}
    </div>
  );
}