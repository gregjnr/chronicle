import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import api from '../services/api.js';
import { Post } from '../types.js';
import { CommentSection } from '../components/CommentSection.js';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal.js';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Tag,
  Edit3,
  Trash2,
  Share2,
  Check,
  Bookmark,
  User as UserIcon,
} from 'lucide-react';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/posts/${id}`);
      if (res.data.success) {
        setPost(res.data.post);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Article not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;
    try {
      setIsDeleting(true);
      const res = await api.delete(`/posts/${post._id}`);
      if (res.data.success) {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete post.');
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-6">
        <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
        <div className="h-12 w-3/4 bg-white/10 rounded animate-pulse" />
        <div className="h-64 w-full bg-white/10 rounded-2xl animate-pulse" />
        <div className="space-y-3 pt-6">
          <div className="h-4 bg-white/10 rounded w-full animate-pulse" />
          <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-white/10 rounded w-4/6 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-md mx-auto py-16 text-center glass-panel p-8 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-2">Article Not Found</h2>
        <p className="text-sm text-[#A1A1AA] mb-6">{error || 'This post may have been removed or does not exist.'}</p>
        <Link to="/" className="btn-primary px-5 py-2.5 text-xs inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4 text-black" /> Back to Feed
        </Link>
      </div>
    );
  }

  const authorId = typeof post.author === 'object' ? post.author?._id : post.author;
  const authorName = typeof post.author === 'object' ? post.author?.name : 'Author';
  const authorAvatar =
    typeof post.author === 'object'
      ? post.author?.avatar
      : `https://api.dicebear.com/7.x/bottts/svg?seed=${authorName}`;
  const authorBio =
    typeof post.author === 'object'
      ? post.author?.bio || 'Writer and contributor on Chronicle.'
      : 'Writer and contributor on Chronicle.';

  const isAuthor = user && (user.id === authorId || (user as any)._id === authorId);

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-white" /> Back to All Articles
        </Link>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white/5 border border-white/15 text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs"
            title="Copy link to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4 text-white" />}
            <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          {/* Author Controls */}
          {isAuthor && (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/10">
              <Link
                to={`/edit/${post._id}`}
                className="btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-white" />
                <span>Edit</span>
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn-danger px-3 py-1.5 text-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Article Header */}
      <header className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 border border-white/20 text-white">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-[#A1A1AA]">
            <Clock className="w-3.5 h-3.5 text-white" />
            {post.readingTime} min read
          </span>
          <span className="flex items-center gap-1 text-xs text-[#A1A1AA]">
            <Eye className="w-3.5 h-3.5 text-white" />
            {post.views || 0} views
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* Author Bar */}
        <div className="flex items-center gap-4 py-4 border-y border-white/10">
          <img
            src={authorAvatar}
            alt={authorName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20 grayscale"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              {authorName}
              {isAuthor && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-black font-bold">
                  You (Author)
                </span>
              )}
            </span>
            <div className="flex items-center gap-2 text-xs text-[#A1A1AA] mt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-white" /> Published on {formattedDate}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative rounded-2xl overflow-hidden mb-10 border border-white/15 shadow-2xl bg-neutral-900">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full max-h-[500px] object-cover filter grayscale contrast-125"
          />
        </div>
      )}

      {/* Main Post Body */}
      <article className="glass-panel p-6 sm:p-10 mb-10 border border-white/15">
        <div className="prose prose-invert max-w-none text-white leading-relaxed text-base sm:text-lg space-y-6">
          {post.content.split('\n\n').map((paragraph, index) => {
            const trimmed = paragraph.trim();

            if (trimmed.startsWith('```')) {
              const lines = trimmed.split('\n');
              const language = lines[0].replace('```', '') || 'code';
              const codeBody = lines.slice(1, -1).join('\n') || lines.slice(1).join('\n').replace(/```$/, '');
              return (
                <div key={index} className="my-6 rounded-xl overflow-hidden border border-white/15 bg-neutral-950">
                  <div className="px-4 py-2 bg-white/5 border-b border-white/10 text-xs font-mono text-white flex justify-between">
                    <span>{language}</span>
                    <span className="text-[10px] text-[#A1A1AA]">Chronicle Code</span>
                  </div>
                  <pre className="p-4 text-xs sm:text-sm font-mono text-white overflow-x-auto">
                    <code>{codeBody}</code>
                  </pre>
                </div>
              );
            }

            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xl sm:text-2xl font-bold text-white pt-4 pb-2 border-b border-white/10">
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }

            if (trimmed.startsWith('## ')) {
              return (
                <h2 key={index} className="text-2xl sm:text-3xl font-extrabold text-white pt-6 pb-2 border-b border-white/10">
                  {trimmed.replace('## ', '')}
                </h2>
              );
            }

            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              const items = trimmed.split('\n');
              return (
                <ul key={index} className="list-disc pl-6 space-y-2 text-white">
                  {items.map((it, idx) => (
                    <li key={idx}>{it.replace(/^[-*]\s+/, '')}</li>
                  ))}
                </ul>
              );
            }

            return (
              <p key={index} className="text-white leading-relaxed">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Tags Footer */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mr-1">
              Tagged:
            </span>
            {post.tags.map((tag, i) => (
              <Link
                key={i}
                to={`/?tag=${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-[#A1A1AA] hover:text-white hover:border-white/40 transition-colors"
              >
                <Tag className="w-3 h-3 text-white" />
                {tag}
              </Link>
            ))}
          </div>
        )}
      </article>

      {/* Author Bio Card */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12 border border-white/15">
        <img
          src={authorAvatar}
          alt={authorName}
          className="w-16 h-16 rounded-full object-cover ring-2 ring-white/20 grayscale flex-shrink-0"
        />
        <div className="text-center sm:text-left flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <h4 className="text-lg font-bold text-white">{authorName}</h4>
              <p className="text-xs text-[#A1A1AA]">Staff Contributor & Author</p>
            </div>
            {isAuthor && (
              <Link to="/dashboard" className="btn-secondary px-3 py-1.5 text-xs">
                Go to Dashboard
              </Link>
            )}
          </div>
          <p className="text-sm text-[#A1A1AA] leading-relaxed">{authorBio}</p>
        </div>
      </div>

      {/* Comments Section */}
      <CommentSection postId={post._id} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Article"
        message={`Are you sure you want to permanently delete "${post.title}"? All associated discussions and reader comments will also be removed.`}
        isDeleting={isDeleting}
        onConfirm={handleDeletePost}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};
