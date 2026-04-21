import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';

/* ─────────────────────────────────────────
   Blog post data
───────────────────────────────────────── */
const POSTS = [
  {
    id: 1,
    category: 'Style Tips',
    title: 'How to Build a Complete School Wardrobe Without Overspending',
    excerpt:
      'Starting the school year right means having the essentials ready before day one. Here are practical tips to put together a durable, complete school wardrobe on a sensible budget.',
    date: 'April 15, 2025',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    id: 2,
    category: 'School Uniforms',
    title: 'Why Uniform Fit Matters More Than You Think',
    excerpt:
      'A uniform that fits well helps children move freely and feel confident throughout the school day. Learn what to look for when sizing school uniforms for growing kids.',
    date: 'April 8, 2025',
    readTime: '4 min read',
    image:
      'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    id: 3,
    category: 'Care Guide',
    title: 'Fabric Care Tips to Make Children\'s Clothing Last Longer',
    excerpt:
      'Washing, drying, and storing clothes the right way adds months — sometimes years — to their life. A few small habits make a big difference for everyday wear and school uniforms alike.',
    date: 'March 28, 2025',
    readTime: '3 min read',
    image:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    id: 4,
    category: 'Style Tips',
    title: 'Festive Outfit Ideas for Children: Comfort Meets Celebration',
    excerpt:
      'Festive dressing for kids should balance looking good with staying comfortable. Here are outfit ideas from our collection that work well for family occasions and celebrations.',
    date: 'March 18, 2025',
    readTime: '4 min read',
    image:
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    id: 5,
    category: 'Crystal News',
    title: 'Crystal Online Store Is Now Live Across India',
    excerpt:
      'After 25+ years of serving families in Chhatrapati Sambhajinagar, we\'re bringing the same quality and service online. Order from anywhere in India with fast, reliable delivery.',
    date: 'March 5, 2025',
    readTime: '2 min read',
    image:
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    id: 6,
    category: 'Care Guide',
    title: 'Choosing the Right Fabric for Your Child\'s Skin Type',
    excerpt:
      'Not every fabric works for every child. Cotton, blends, and synthetic fabrics each have tradeoffs. This guide helps you pick clothing that keeps kids comfortable all day.',
    date: 'February 22, 2025',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
];

const CATEGORIES = ['All', 'Style Tips', 'School Uniforms', 'Care Guide', 'Crystal News'];

/* ─────────────────────────────────────────
   Post card
───────────────────────────────────────── */
function PostCard({ post }: { post: (typeof POSTS)[number] }) {
  return (
    <article className="card card-hover flex flex-col overflow-hidden group">
      <div className="overflow-hidden aspect-[16/9]">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col flex-1 p-6 gap-3">
        <div className="flex items-center gap-2">
          <span className="badge bg-brand/10 text-brand">
            <Tag size={11} className="mr-1" />
            {post.category}
          </span>
        </div>
        <h3 className="h3 text-lg leading-snug group-hover:text-brand transition-colors">
          {post.title}
        </h3>
        <p className="text-muted text-sm leading-relaxed flex-1">{post.excerpt}</p>
        <div className="flex items-center justify-between pt-3 border-t border-line">
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {post.readTime}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-brand opacity-0 group-hover:opacity-100 transition-opacity">
            Read <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────
   Main page
───────────────────────────────────────── */
export const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const featured = POSTS.find((p) => p.featured)!;
  const filtered =
    activeCategory === 'All'
      ? POSTS.filter((p) => !p.featured)
      : POSTS.filter((p) => p.category === activeCategory && !p.featured);

  return (
    <div className="page">

      {/* ── PAGE HERO ─────────────────────────────── */}
      <section className="section-hero section-muted border-b border-line">
        <div className="container mx-auto max-w-7xl text-center">
          <p className="caption text-brand mb-4">Crystal Journal</p>
          <h1 className="h1 mb-4">Style, Care & Family</h1>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Tips on dressing kids well, caring for clothes, and making the most
            of every school year — from the Crystal team.
          </p>
        </div>
      </section>

      {/* ── FEATURED POST ─────────────────────────── */}
      <section className="section border-b border-line">
        <div className="container mx-auto max-w-7xl">
          <p className="caption text-brand mb-6">Featured</p>

          <article className="card overflow-hidden group">
            <div className="grid lg:grid-cols-2">
              {/* Image */}
              <div className="overflow-hidden aspect-[4/3] lg:aspect-auto">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-8 sm:p-10 flex flex-col justify-center gap-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="badge bg-brand/10 text-brand">
                    <Tag size={11} className="mr-1" />
                    {featured.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted">
                    <Calendar size={12} /> {featured.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted">
                    <Clock size={12} /> {featured.readTime}
                  </span>
                </div>

                <h2 className="h2 leading-snug group-hover:text-brand transition-colors">
                  {featured.title}
                </h2>
                <p className="text-muted leading-relaxed">{featured.excerpt}</p>

                <div>
                  <Link to="/blog" className="btn btn-primary gap-2">
                    Read Article <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ── CATEGORY FILTER ───────────────────────── */}
      <section className="section border-b border-line">
        <div className="container mx-auto max-w-7xl">

          {/* Filter tabs */}
          <div className="flex items-center gap-2 flex-wrap mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  activeCategory === cat
                    ? 'bg-brand text-white border-brand'
                    : 'bg-surface border-line text-muted hover:border-brand/40 hover:text-brand'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Post grid */}
          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted">
              <p className="text-lg font-medium text-text mb-2">No posts yet</p>
              <p className="text-sm">Check back soon — more articles are on the way.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── NEWSLETTER CTA ────────────────────────── */}
      <section className="section section-muted">
        <div className="container mx-auto max-w-7xl">
          <div className="card p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <p className="caption text-brand mb-3">Stay Updated</p>
            <h2 className="h2 mb-3">New Articles Every Week</h2>
            <p className="text-muted mb-8 leading-relaxed">
              From care tips to seasonal outfit guides — useful reads for every
              Crystal family, straight to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="input flex-1"
                required
              />
              <button type="submit" className="btn btn-primary gap-2 whitespace-nowrap">
                Subscribe <ArrowRight size={15} />
              </button>
            </form>
            <p className="text-xs text-muted mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default BlogPage;
