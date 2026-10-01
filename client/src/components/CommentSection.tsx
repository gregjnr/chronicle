import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import api from '../services/api.js';
import { Comment } from '../types.js';
import { DeleteConfirmModal } from './DeleteConfirmModal.js';
import { MessageSquare, Send, Trash2, LogIn, AlertCircle } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Deletion modal state
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/comments/post/${postId}`);
      if (res.data.success) {
        setComments(res.data.comments);
      }
    } catch (err: any) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      const res = await api.post(`/comments/post/${postId}`, {
        content: content.trim(),
      });

      if (res.data.success) {
        setComments((prev) => [res.data.comment, ...prev]);
        setContent('');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      setIsDeleting(true);
      const res = await api.delete(`/comments/${commentToDelete}`);
      if (res.data.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentToDelete));
        setCommentToDelete(null);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete comment.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-black" />
        </div>
        <h3 className="text-xl font-bold text-white">
          Discussion ({comments.length})
        </h3>
      </div>

      {/* Comment Form or Login Prompt */}
      {isAuthenticated && user ? (
        <form onSubmit={handleSubmit} className="glass-panel p-5 mb-8 border border-white/15">
          <div className="flex items-start gap-3">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30 grayscale flex-shrink-0"
            />
            <div className="flex-grow">
              <label htmlFor="commentText" className="sr-only">
                Add a comment
              </label>
              <textarea
                id="commentText"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your perspectives, questions, or feedback..."
                className="w-full glass-input p-3 text-sm resize-none"
                maxLength={1000}
                required
              />
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-xs text-[#A1A1AA]">
                  {content.length}/1000 characters
                </span>
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="btn-primary px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-black" />
                      Post Comment
                    </>
                  )}
                </button>
              </div>
              {error && (
                <div className="mt-3 p-2.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-white" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </form>
      ) : (
        <div className="glass-panel p-6 mb-8 text-center flex flex-col items-center justify-center border border-white/15">
          <p className="text-white font-medium text-sm mb-2">
            Have thoughts on this story?
          </p>
          <p className="text-xs text-[#A1A1AA] mb-4 max-w-sm">
            Sign in to your Chronicle account to join the conversation and interact with fellow readers.
          </p>
          <Link
            to="/login"
            className="btn-primary px-5 py-2.5 text-xs flex items-center gap-2"
          >
            <LogIn className="w-4 h-4 text-black" />
            Sign In to Comment
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="glass-panel p-4 animate-pulse border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <div className="h-3 w-28 bg-white/10 rounded" />
              </div>
              <div className="h-4 w-full bg-white/10 rounded mb-1" />
              <div className="h-4 w-3/4 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="glass-panel-subtle p-8 text-center text-[#A1A1AA] border border-white/10">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-white" />
          <p className="text-sm font-medium text-white">No comments yet</p>
          <p className="text-xs mt-1">Be the first to share your thoughts on this story!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const commentAuthorId =
              typeof comment.author === 'object' ? comment.author?._id : comment.author;
            const commentAuthorName =
              typeof comment.author === 'object' ? comment.author?.name : 'Reader';
            const commentAuthorAvatar =
              typeof comment.author === 'object'
                ? comment.author?.avatar
                : `https://api.dicebear.com/7.x/bottts/svg?seed=Reader`;

            const isAuthor = user && (user.id === commentAuthorId || (user as any)._id === commentAuthorId);

            const dateStr = new Date(comment.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={comment._id}
                className="glass-panel p-4 sm:p-5 transition-all duration-200 border border-white/15 hover:border-white/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={commentAuthorAvatar}
                      alt={commentAuthorName}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20 grayscale"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {commentAuthorName}
                        </span>
                        {isAuthor && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-white text-black font-bold">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#A1A1AA]">{dateStr}</span>
                    </div>
                  </div>

                  {/* Delete button (Author only) */}
                  {isAuthor && (
                    <button
                      onClick={() => setCommentToDelete(comment._id)}
                      className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors"
                      title="Delete your comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="mt-3 text-sm text-white leading-relaxed whitespace-pre-wrap pl-12">
                  {comment.content}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Comment Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!commentToDelete}
        title="Delete Comment"
        message="Are you sure you want to permanently delete this comment? This action cannot be undone."
        isDeleting={isDeleting}
        onConfirm={handleDeleteComment}
        onCancel={() => setCommentToDelete(null)}
      />
    </section>
  );
};
