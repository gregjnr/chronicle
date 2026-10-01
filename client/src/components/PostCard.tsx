import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types.js';
import { Clock, Eye, Calendar, Tag, ArrowRight } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const authorName = typeof post.author === 'object' ? post.author?.name : 'Chronicle Author';
  const authorAvatar =
    typeof post.author === 'object'
      ? post.author?.avatar
      : `https://api.dicebear.com/7.x/bottts/svg?seed=Author`;

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="glass-panel-interactive flex flex-col h-full overflow-hidden group border border-white/15">
      {/* Cover Image Container */}
      {post.coverImage ? (
        <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out filter grayscale contrast-125"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLElement).parentElement!.style.display = 'none';
            }}
          />
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md bg-black/70 text-white border border-white/20">
              {post.category}
            </span>
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-black/80 backdrop-blur-md text-white border border-white/10">
            <Clock className="w-3.5 h-3.5 text-white" />
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      ) : (
        <div className="pt-4 px-6 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md bg-white/10 text-white border border-white/20">
            {post.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
            <Clock className="w-3.5 h-3.5 text-white" />
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          {/* Post Title */}
          <Link to={`/post/${post._id}`} className="block group-hover:text-white transition-colors">
            <h3 className="font-bold text-lg md:text-xl text-white leading-snug line-clamp-2 mb-2.5 group-hover:underline">
              {post.title}
            </h3>
          </Link>

          {/* Post Excerpt */}
          <p className="text-sm text-[#A1A1AA] line-clamp-3 leading-relaxed mb-4">
            {post.excerpt || post.content.substring(0, 140) + '...'}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {post.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-[#A1A1AA] border border-white/10"
                >
                  <Tag className="w-2.5 h-2.5 text-white" />
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-[11px] px-1.5 py-0.5 text-[#A1A1AA]">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer: Author + Views & Read More */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
          {/* Author metadata */}
          <div className="flex items-center gap-3">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20 grayscale"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white leading-tight">{authorName}</span>
              <span className="text-[11px] text-[#A1A1AA] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-white" />
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Read button / views */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#A1A1AA] flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-white" />
              {post.views || 0}
            </span>
            <Link
              to={`/post/${post._id}`}
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-all duration-200"
              aria-label={`Read ${post.title}`}
            >
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
