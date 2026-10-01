import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api.js';
import {
  PenSquare,
  ArrowLeft,
  Image,
  Tag,
  Sparkles,
  Eye,
  Edit,
  AlertCircle,
  CheckCircle2,
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

const COVER_PRESETS = [
  {
    name: 'Cybernetic Tech',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Minimal Glass',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Code Matrix',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Neural AI',
    url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Workspace Flow',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
  },
];

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [tagsInput, setTagsInput] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please provide a compelling article title.');
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

      const res = await api.post('/posts', {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || undefined,
        category,
        tags,
        coverImage: coverImage.trim() || undefined,
      });

      if (res.data.success && res.data.post) {
        navigate(`/post/${res.data.post._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to publish article. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-white" /> Cancel & Return
        </Link>
        <span className="text-xs text-white font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-white" /> Drafting New Story
        </span>
      </div>

      {/* Main Form Card */}
      <div className="glass-panel p-6 sm:p-10 border border-white/20">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center">
            <PenSquare className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Create New Article</h1>
            <p className="text-xs text-[#A1A1AA]">
              Share your engineering insights, architectural lessons, or design perspectives.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-white/10 border border-white/25 text-sm text-white flex items-start gap-3 animate-in fade-in duration-150">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-white" />
            <div>
              <p className="font-semibold text-white">Unable to publish article</p>
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
              placeholder="e.g., Scaling Microservices with Node.js and Event Streams"
              className="w-full glass-input p-3 text-base font-semibold placeholder:font-normal"
              maxLength={150}
              required
            />
            <div className="flex justify-between text-[11px] text-[#A1A1AA] mt-1">
              <span>Write a clear, descriptive headline</span>
              <span>{title.length}/150</span>
            </div>
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
                placeholder="e.g., React, TypeScript, Architecture, CSS"
                className="w-full glass-input p-3 text-sm"
              />
              <span className="text-[11px] text-[#A1A1AA] mt-1 block">
                Separate tags with commas
              </span>
            </div>
          </div>

          {/* Cover Image URL & Presets */}
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-white" /> Cover Image URL (Optional)
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full glass-input p-3 text-sm mb-2"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs text-[#A1A1AA]">Quick presets:</span>
              {COVER_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setCoverImage(preset.url)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 hover:border-white hover:text-white text-[#A1A1AA] transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Cover Preview */}
            {coverImage && (
              <div className="mt-3 relative h-40 rounded-xl overflow-hidden border border-white/20 bg-neutral-900">
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover filter grayscale contrast-125"
                  onError={() => setError('Invalid image URL. Please check the image link.')}
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
              Brief Excerpt (Optional)
            </label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short 1-2 sentence preview for feed cards (defaults to first paragraph if empty)"
              className="w-full glass-input p-3 text-sm"
              maxLength={300}
            />
          </div>

          {/* Content Write / Preview Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                Article Content <span className="text-white">*</span>
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
                placeholder="Write your article in markdown or formatted paragraphs...

## Key Architectural Insights
Explain your core concepts here.

```typescript
const example = 'Code formatting supported';
```

- High performance
- Accessible design"
                className="w-full glass-input p-4 text-sm font-mono leading-relaxed resize-y focus:ring-1 focus:ring-white"
                required
              />
            ) : (
              <div className="w-full min-h-[300px] p-6 glass-panel-subtle rounded-xl text-white space-y-4 border border-white/15">
                {content ? (
                  content.split('\n\n').map((paragraph, idx) => {
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
                  })
                ) : (
                  <p className="text-xs text-[#A1A1AA] italic">
                    Nothing to preview yet. Switch back to Write tab to begin your article.
                  </p>
                )}
              </div>
            )}
            <span className="text-[11px] text-[#A1A1AA] mt-1 block">
              Tip: Supports markdown headings (## Heading), lists (- bullet), and code blocks (```code```).
            </span>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-4">
            <Link to="/" className="btn-secondary px-5 py-2.5 text-xs font-medium">
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
                  Publishing Story...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  Publish Article
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
