import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api.js';
import { Post, PostsResponse } from '../types.js';
import { PostCard } from '../components/PostCard.js';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  X,
  ChevronLeft,
  ChevronRight,
  PenSquare,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Technology',
  'Design',
  'Development',
  'AI & ML',
  'Career',
  'Lifestyle',
];

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const searchQuery = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || 'All';
  const currentTag = searchParams.get('tag') || '';
  const currentSort = (searchParams.get('sort') as 'newest' | 'oldest' | 'views') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Local state
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>(searchQuery);
  const [stats, setStats] = useState({ totalPosts: 6, totalComments: 4, totalUsers: 4 });

  useEffect(() => {
    fetchPosts();
  }, [searchQuery, currentCategory, currentTag, currentSort, currentPage]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/posts/categories-tags');
      if (res.data.success) {
        setStats({
          totalPosts: res.data.totalPosts || 6,
          totalComments: res.data.totalComments || 4,
          totalUsers: 4,
        });
      }
    } catch (e) {
      console.warn('Failed to load stats', e);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 6,
        sort: currentSort,
      };

      if (searchQuery) params.search = searchQuery;
      if (currentCategory && currentCategory !== 'All') params.category = currentCategory;
      if (currentTag) params.tag = currentTag;

      const res = await api.get<PostsResponse>('/posts', { params });
      if (res.data.success) {
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
        setTotalPosts(res.data.totalPosts);
      }
    } catch (err: any) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleCategorySelect = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (sort: 'newest' | 'oldest' | 'views') => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sort);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const isFiltered = !!searchQuery || (currentCategory && currentCategory !== 'All') || !!currentTag;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative pt-6 pb-4 sm:pt-12 sm:pb-8 text-center max-w-4xl mx-auto">
        {/* Monochromatic badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white backdrop-blur-md mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Monochrome Glass Publishing</span>
        </div>

        {/* Hero Title in Black and White */}
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
          Ideas Crafted with <br className="hidden sm:inline" />
          <span className="text-white underline decoration-white/30 decoration-4 underline-offset-8">
            Clarity & Depth.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-[#A1A1AA] max-w-2xl mx-auto mb-8 leading-relaxed">
          Chronicle is an architectural blog space for engineering insights, spatial design, and
          digital craft in a refined black & white visual palette.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link
            to="/create"
            className="btn-primary px-6 py-3 text-sm flex items-center gap-2"
          >
            <PenSquare className="w-4 h-4 text-black" />
            Start Writing Today
          </Link>
          <a
            href="#articles-feed"
            className="btn-secondary px-6 py-3 text-sm flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-white" />
            Browse Articles
          </a>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 max-w-xl mx-auto glass-panel p-4 divide-x divide-white/10 border border-white/15">
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalPosts}</div>
            <div className="text-[11px] sm:text-xs text-[#A1A1AA]">Published Articles</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white">{CATEGORIES.length - 1}</div>
            <div className="text-[11px] sm:text-xs text-[#A1A1AA]">Curated Categories</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalComments}+</div>
            <div className="text-[11px] sm:text-xs text-[#A1A1AA]">Community Voices</div>
          </div>
        </div>
      </section>

      {/* Main Feed Controls & Articles Grid */}
      <section id="articles-feed" className="scroll-mt-24 space-y-6">
        {/* Search & Filter Toolbar */}
        <div className="glass-panel p-4 sm:p-5 space-y-4 border border-white/15">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-grow max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search articles by title, keyword, or author..."
                className="w-full glass-input pl-10 pr-10 py-2.5 text-sm"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('search');
                    newParams.set('page', '1');
                    setSearchParams(newParams);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <SlidersHorizontal className="w-4 h-4 text-white" />
              <span className="text-xs text-[#A1A1AA]">Sort:</span>
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value as any)}
                className="glass-input px-3 py-1.5 text-xs text-white bg-black border border-white/20 focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-black text-white">Newest First</option>
                <option value="oldest" className="bg-black text-white">Oldest First</option>
                <option value="views" className="bg-black text-white">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const active = currentCategory === cat || (cat === 'All' && !searchParams.get('category'));
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    active
                      ? 'bg-white text-black font-bold shadow-md shadow-white/10'
                      : 'bg-white/5 text-[#A1A1AA] hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Active Filter Pills Indicator */}
          {isFiltered && (
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-[#A1A1AA]">
              <div className="flex items-center gap-2">
                <span>Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                    "{searchQuery}"
                  </span>
                )}
                {currentCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                    {currentCategory}
                  </span>
                )}
                {currentTag && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                    #{currentTag}
                  </span>
                )}
              </div>
              <button
                onClick={clearAllFilters}
                className="text-xs text-white hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between px-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
            Showing <span className="text-white font-bold">{posts.length}</span> of{' '}
            <span className="text-white font-bold">{totalPosts}</span> articles
          </p>
          {currentPage > 1 && (
            <span className="text-xs text-[#A1A1AA]">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="glass-panel h-80 rounded-2xl p-6 flex flex-col justify-between animate-pulse border border-white/10"
              >
                <div className="h-32 bg-white/10 rounded-xl mb-4" />
                <div className="space-y-2">
                  <div className="h-5 bg-white/10 rounded w-3/4" />
                  <div className="h-4 bg-white/10 rounded w-full" />
                </div>
                <div className="h-8 bg-white/10 rounded-full w-1/2 mt-4" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-panel p-12 text-center max-w-lg mx-auto border border-white/15">
            <BookOpen className="w-12 h-12 mx-auto text-white opacity-40 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">No articles matched your criteria</h3>
            <p className="text-xs text-[#A1A1AA] mb-6">
              Try adjusting your search keywords, switching categories, or clearing active filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="btn-primary px-5 py-2.5 text-xs inline-flex items-center gap-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="btn-secondary p-2.5 text-xs flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-white text-black shadow-lg shadow-white/10 border border-white'
                    : 'bg-white/5 text-[#A1A1AA] hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="btn-secondary p-2.5 text-xs flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next Page"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
