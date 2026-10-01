import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import api from '../services/api.js';
import {
  Edit3,
  ArrowLeft,
  Image,
  Tag,
  Eye,
  Edit,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const CATEGORIES = [
  'Technology',
  'Design',
  'Development',
  'AI & ML',
  'Career',
  'Lifestyle',
  'Tutorials',
  'Other',
];

export const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [tagsInput, setTagsInput] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/posts/${id}`);
      if (res.data.success) {
        const post = res.data.post;

        // Author ownership check
        const authorId = typeof post.author === 'object' ? post.author._id : post.author;
        if (user && user.id !== authorId && (user as any)._id !== authorId) {
          setUnauthorized(true);
          return;
        }

        setTitle(post.title);
        setCategory(post.category);
        setTagsInput(post.tags?.join(', ') || '');
        setCoverImage(post.coverImage || '');
        setExcerpt(post.excerpt || '');
        setContent(post.content);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load article for editing.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please provide a post title.');
      return;
    }
    if (!content.trim()) {
      setError('Article content cannot be empty.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await api.put(`/posts/${id}`, {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || undefined,
        category,
        tags,
        coverImage: coverImage.trim() || undefined,
      });

      if (res.data.success) {
        navigate(`/post/${id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update article.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-[#A1A1AA]">Loading article data...</p>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="max-w-md mx-auto py-16 text-center glass-panel p-8 border border-white/20">
        <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6 text-black" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Access Forbidden</h2>
        <p className="text-sm text-[#A1A1AA] mb-6">
          You do not have permission to edit this article. Only the original author can make changes.
        </p>
        <Link to="/" className="btn-primary px-5 py-2.5 text-xs inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4 text-black" /> Return to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to={`/post/${id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-white" /> Back to Article
        </Link>
        <span className="text-xs text-white font-semibold flex items-center gap-1.5">
          <Edit3 className="w-3.5 h-3.5 text-white" /> Editing Mode
        </span>
      </div>

      {/* Main Form Card */}
      <div className="glass-panel p-6 sm:p-10 border border-white/20">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center">
            <Edit3 className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Article</h1>
            <p className="text-xs text-[#A1A1AA]">
              Update your article contents, metadata, cover, or tags.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-white/10 border border-white/20 text-sm text-white flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-white" />
            <div>
              <p className="font-semibold text-white">Unable to save updates</p>
              <p className="text-xs mt-0.5 text-[#A1A1AA]">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
              Article Title <span className="text-white">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full glass-input p-3 text-base font-semibold"
              maxLength={150}
              required
            />
          </div>

          {/* Category & Tags Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Category <span className="text-white">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full glass-input p-3 text-sm bg-black border border-white/20 cursor-pointer text-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-black text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-white" /> Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full glass-input p-3 text-sm"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-white" /> Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full glass-input p-3 text-sm"
            />
            {coverImage && (
              <div className="mt-3 relative h-40 rounded-xl overflow-hidden border border-white/20 bg-neutral-900">
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  className="w-full h-full object-cover filter grayscale contrast-125"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="absolute top-2 right-2 px-2.5 py-1 rounded bg-black/80 text-xs text-white border border-white/20"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
              Excerpt
            </label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full glass-input p-3 text-sm"
              maxLength={300}
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                Content <span className="text-white">*</span>
              </label>
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === 'write'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  <Edit className="w-3.5 h-3.5" /> Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === 'preview'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Live Preview
                </button>
              </div>
            </div>

            {activeTab === 'write' ? (
              <textarea
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full glass-input p-4 text-sm font-mono leading-relaxed resize-y focus:ring-1 focus:ring-white"
                required
              />
            ) : (
              <div className="w-full min-h-[300px] p-6 glass-panel-subtle rounded-xl text-white space-y-4 border border-white/15">
                {content.split('\n\n').map((paragraph, idx) => {
                  const trimmed = paragraph.trim();
                  if (trimmed.startsWith('```')) {
                    return (
                      <pre key={idx} className="p-3 bg-neutral-950 rounded-lg text-xs font-mono text-white border border-white/10">
                        <code>{trimmed.replace(/```/g, '')}</code>
                      </pre>
                    );
                  }
                  if (trimmed.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="text-xl font-bold text-white border-b border-white/10 pb-1">
                        {trimmed.replace('## ', '')}
                      </h2>
                    );
                  }
                  return <p key={idx} className="text-sm leading-relaxed">{trimmed}</p>;
                })}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-4">
            <Link to={`/post/${id}`} className="btn-secondary px-5 py-2.5 text-xs font-medium">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
