import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import api from '../services/api.js';
import { Post } from '../types.js';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal.js';
import {
  LayoutDashboard,
  PenSquare,
  BookOpen,
  Eye,
  MessageSquare,
  Edit3,
  Trash2,
  ExternalLink,
  Search,
  Plus,
  Clock,
  Sparkles,
  Calendar,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState({ totalPosts: 0, totalViews: 0, totalComments: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Delete modal state
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/posts/user/me');
      if (res.data.success) {
        setPosts(res.data.posts);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err: any) {
      console.error('Failed to load user posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    try {
      setIsDeleting(true);
      const res = await api.delete(`/posts/${postToDelete._id}`);
      if (res.data.success) {
        setPosts((prev) => prev.filter((p) => p._id !== postToDelete._id));
        setStats((prev) => ({
          ...prev,
          totalPosts: Math.max(0, prev.totalPosts - 1),
          totalViews: Math.max(0, prev.totalViews - (postToDelete.views || 0)),
        }));
        setPostToDelete(null);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete post.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 sm:p-8 border border-white/20">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/30 grayscale shadow-xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-black">
                Author
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA] mt-0.5">{user?.email}</p>
            <p className="text-xs text-white mt-1 italic max-w-md line-clamp-1">{user?.bio}</p>
          </div>
        </div>

        <Link
          to="/create"
          className="btn-primary px-5 py-3 text-xs flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <PenSquare className="w-4 h-4 text-black" />
          Write New Article
        </Link>
      </div>

      {/* Analytics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 border border-white/15">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-[#A1A1AA]">My Articles</span>
            <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalPosts}</div>
          <p className="text-[11px] text-[#A1A1AA] mt-1">Total published stories</p>
        </div>

        <div className="glass-panel p-6 border border-white/15">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-[#A1A1AA]">Total Readership</span>
            <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalViews}</div>
          <p className="text-[11px] text-[#A1A1AA] mt-1">Reader impressions</p>
        </div>

        <div className="glass-panel p-6 border border-white/15">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-[#A1A1AA]">Discussions</span>
            <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalComments}</div>
          <p className="text-[11px] text-[#A1A1AA] mt-1">Comments on your stories</p>
        </div>
      </div>

      {/* Articles Management Table/List */}
      <div className="glass-panel p-6 sm:p-8 space-y-6 border border-white/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-white" />
              Manage Published Articles ({posts.length})
            </h2>
            <p className="text-xs text-[#A1A1AA]">
              Edit, delete, and monitor your personal articles.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A1A1AA]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your articles..."
              className="w-full glass-input pl-9 pr-3 py-1.5 text-xs"
            />
          </div>
        </div>

        {/* List of User's Posts */}
        {loading ? (
          <div className="space-y-4 py-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-12 text-center">
            {posts.length === 0 ? (
              <div>
                <BookOpen className="w-12 h-12 text-white opacity-40 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">You haven't written any articles yet</h3>
                <p className="text-xs text-[#A1A1AA] mb-6 max-w-sm mx-auto">
                  Begin sharing your technical insights or design knowledge with the community.
                </p>
                <Link
                  to="/create"
                  className="btn-primary px-5 py-2.5 text-xs inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-black" /> Create Your First Story
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-sm text-white font-medium">No articles matched "{searchTerm}"</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-white hover:underline mt-2"
                >
                  Clear search query
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white/[0.04] -mx-4 px-4 rounded-xl transition-colors"
              >
                {/* Post details */}
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/10 text-white border border-white/20">
                      {post.category}
                    </span>
                    <span className="text-[11px] text-[#A1A1AA] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-white" />
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-[11px] text-[#A1A1AA] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-white" />
                      {post.readingTime}m read
                    </span>
                  </div>

                  <Link
                    to={`/post/${post._id}`}
                    className="block font-bold text-base text-white group-hover:underline transition-colors leading-snug"
                  >
                    {post.title}
                  </Link>

                  <div className="flex items-center gap-4 text-xs text-[#A1A1AA]">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-white" /> {post.views || 0} views
                    </span>
                    {post.tags && post.tags.length > 0 && (
                      <span className="text-[11px] text-[#A1A1AA]">
                        Tags: {post.tags.slice(0, 3).join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <Link
                    to={`/post/${post._id}`}
                    className="p-2 rounded-lg bg-white/5 border border-white/15 text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors"
                    title="View Published Post"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/edit/${post._id}`}
                    className="p-2 rounded-lg bg-white/5 border border-white/15 text-white hover:bg-white/15 transition-colors"
                    title="Edit Post"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => setPostToDelete(post)}
                    className="p-2 rounded-lg bg-white/5 border border-white/15 text-white hover:bg-white hover:text-black transition-colors"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!postToDelete}
        title="Delete Article"
        message={`Are you sure you want to permanently delete "${postToDelete?.title}"? All readers' comments and view statistics will also be deleted.`}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPostToDelete(null)}
      />
    </div>
  );
};
