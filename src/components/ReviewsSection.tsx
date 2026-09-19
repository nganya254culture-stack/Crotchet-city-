import React, { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, MessageSquarePlus, Sparkles, Filter, ShieldCheck, Heart, User } from 'lucide-react';
import { REVIEWS, EMPLOYEES } from '../data/crochetData';
import { CustomerReview } from '../types';
import { BackToTopBar } from './BackToTopBar';
import { SectionBackToIndex } from './SectionBackToIndex';

export const ReviewsSection: React.FC = () => {
  const [reviewsList, setReviewsList] = useState<CustomerReview[]>(REVIEWS);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [helpfulCounts, setHelpfulCounts] = useState<{ [key: string]: number }>({});

  // New review form states
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newService, setNewService] = useState('Instant Needle Crochet Retwist');
  const [newLoctician, setNewLoctician] = useState('P The dread genius');
  const [newLocAge, setNewLocAge] = useState('3 Years Loc’d');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');

  const handleHelpfulClick = (id: string, initialCount: number) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialCount) + 1
    }));
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const createdReview: CustomerReview = {
      id: 'rev-custom-' + Date.now(),
      author: newAuthor,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      locAge: newLocAge,
      serviceType: newService,
      locticianName: newLoctician,
      rating: newRating,
      date: 'Just now',
      title: newTitle || 'Exceptional needle work!',
      comment: newComment,
      verified: true,
      helpfulCount: 1
    };

    setReviewsList([createdReview, ...reviewsList]);
    setShowAddReviewModal(false);
    // Reset form
    setNewAuthor('');
    setNewTitle('');
    setNewComment('');
  };

  const filteredReviews = selectedFilter === 'all'
    ? reviewsList
    : reviewsList.filter((r) => r.serviceType.toLowerCase().includes(selectedFilter.toLowerCase()) || r.rating.toString() === selectedFilter);

  return (
    <section className="py-8 sm:py-14 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Index Navigation Breadcrumb Bar */}
        <SectionBackToIndex sectionTitle="Customer Reviews & Ratings" categoryBadge="Verified Clients" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Verified Client Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-cinzel">
              Praised for Neatness & Authenticity
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
              Real feedback from dreadlock veterans, professionals, athletes, and first-time loc journeyers across East Africa.
            </p>
          </div>

          {/* Aggregate Rating Score Box & Add Review Button */}
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[#111913] border border-[#213224] text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div className="text-xl font-extrabold text-white mt-1">4.98 / 5.0</div>
              <p className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                340+ Verified Reviews
              </p>
            </div>

            <button
              id="write-review-open-btn"
              onClick={() => setShowAddReviewModal(true)}
              className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all shrink-0"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'crochet', label: 'Needle Crochet Retwist' },
            { id: 'starter', label: 'Starter Locs' },
            { id: 'repair', label: 'Loc Surgery & Repair' },
            { id: 'sisterlocks', label: 'Sisterlocks & Microlocs' },
            { id: 'detox', label: 'ACV Detox' },
          ].map((f) => (
            <button
              key={f.id}
              id={`filter-review-${f.id}`}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                selectedFilter === f.id
                  ? 'bg-emerald-700 text-white font-bold'
                  : 'bg-[#121913] text-stone-400 hover:text-stone-200 border border-[#1e2a20]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => {
            const currentHelpful = helpfulCounts[rev.id] ?? rev.helpfulCount;
            return (
              <div
                key={rev.id}
                className="rounded-2xl bg-[#0e1410] border border-[#1d2b20] p-6 flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-colors"
              >
                <div>
                  {/* Top Client Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.avatar}
                        alt={rev.author}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-[#25392b]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-extrabold text-white font-syne">
                            {rev.author}
                          </h4>
                          {rev.verified && (
                            <span 
                              title="Verified Client of Crochet City"
                              className="w-4 h-4 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center text-[10px]"
                            >
                              ✓
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-amber-400 font-medium">{rev.locAge}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] text-stone-500 mt-0.5 block">{rev.date}</span>
                    </div>
                  </div>

                  {/* Title & Review body */}
                  <div className="mt-3.5">
                    <h5 className="text-sm font-bold text-stone-100 font-syne">
                      &quot;{rev.title}&quot;
                    </h5>
                    <p className="text-xs text-stone-300 mt-2 leading-relaxed font-light">
                      {rev.comment}
                    </p>
                  </div>
                </div>

                {/* Loctician & Service Tag */}
                <div className="pt-3 border-t border-[#1a261d] space-y-2">
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-400">
                    <span>
                      Service: <strong className="text-stone-300">{rev.serviceType}</strong>
                    </span>
                    <span>
                      Loctician: <strong className="text-emerald-400">{rev.locticianName}</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-stone-400">
                    <span className="text-stone-500">Verified Crochet City Chair</span>
                    <button
                      id={`helpful-btn-${rev.id}`}
                      onClick={() => handleHelpfulClick(rev.id, rev.helpfulCount)}
                      className="flex items-center gap-1 hover:text-amber-400 cursor-pointer transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful ({currentHelpful})</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* WRITE REVIEW MODAL */}
        {showAddReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-lg rounded-2xl bg-[#0e1611] border border-[#233527] shadow-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#1c2a1f]">
                <h3 className="text-lg font-bold text-white font-cinzel">
                  Share Your Experience With Crochet City
                </h3>
                <button
                  id="close-add-review-btn"
                  onClick={() => setShowAddReviewModal(false)}
                  className="text-stone-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddReview} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-stone-300 font-bold mb-1">Your Name</label>
                    <input
                      id="new-review-author"
                      type="text"
                      required
                      placeholder="e.g. Victor Otieno"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full bg-[#121c15] border border-[#233527] rounded-lg p-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-300 font-bold mb-1">Loc Journey</label>
                    <input
                      id="new-review-loc-age"
                      type="text"
                      placeholder="e.g. 4 Years Loc'd"
                      value={newLocAge}
                      onChange={(e) => setNewLocAge(e.target.value)}
                      className="w-full bg-[#121c15] border border-[#233527] rounded-lg p-2 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-stone-300 font-bold mb-1">Who styled you?</label>
                    <select
                      id="new-review-stylist"
                      value={newLoctician}
                      onChange={(e) => setNewLoctician(e.target.value)}
                      className="w-full bg-[#121c15] border border-[#233527] rounded-lg p-2 text-white text-xs"
                    >
                      {EMPLOYEES.map((e) => (
                        <option key={e.id} value={e.name}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-stone-300 font-bold mb-1">Rating</label>
                    <div className="flex items-center gap-1 pt-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          id={`star-btn-${star}`}
                          onClick={() => setNewRating(star)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              newRating >= star
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-stone-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-stone-300 font-bold mb-1">Headline</label>
                  <input
                    id="new-review-title"
                    type="text"
                    placeholder="e.g. Best crochet retwist in Nairobi!"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#121c15] border border-[#233527] rounded-lg p-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-300 font-bold mb-1">Review Comments</label>
                  <textarea
                    id="new-review-comment"
                    rows={3}
                    required
                    placeholder="Tell us about the neatness, the needle technique, and how long your locs stayed clean..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-[#121c15] border border-[#233527] rounded-lg p-2 text-white text-xs"
                  />
                </div>

                <button
                  type="submit"
                  id="submit-new-review-btn"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Publish Verified Review
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Effortless return to top menu */}
        <BackToTopBar currentSectionName="Customer Reviews & Ratings" />
      </div>
    </section>
  );
};
