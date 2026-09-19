import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Compass, ArrowLeft, ArrowRight } from 'lucide-react';

export interface PageDefinition {
  id: string;
  title: string;
  shortTitle: string;
}

export const APP_PAGES: PageDefinition[] = [
  { id: 'hero-page', title: 'Studio Intro & Crown Philosophy', shortTitle: 'Intro' },
  { id: 'services-section', title: 'Services & Rates Menu', shortTitle: 'Services' },
  { id: 'transformations-section', title: 'Before & After Showcase', shortTitle: 'Before & After' },
  { id: 'reviews-section', title: 'Verified Client Reviews', shortTitle: 'Reviews (4.98★)' },
  { id: 'team-section', title: 'P The Dread Genius & Crew', shortTitle: 'Artisan Crew' },
  { id: 'care-section', title: 'Wax-Free Loc Care Manifesto', shortTitle: 'Loc Care' },
  { id: 'location-section', title: 'Westlands Studio & Contact', shortTitle: 'Location' },
];

interface SwipeNavigationControllerProps {
  onPageChange?: (pageIndex: number, pageId: string) => void;
}

export const SwipeNavigationController: React.FC<SwipeNavigationControllerProps> = ({ onPageChange }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [swipeFeedback, setSwipeFeedback] = useState<{ direction: 'back' | 'next'; text: string } | null>(null);
  const [showPill, setShowPill] = useState(true);

  // Touch tracking refs
  const touchStartPos = useRef<{ x: number; y: number; time: number } | null>(null);

  // Scroll to a specific page
  const navigateToPage = useCallback((index: number, direction?: 'back' | 'next') => {
    const targetIdx = Math.max(0, Math.min(APP_PAGES.length - 1, index));
    const targetPage = APP_PAGES[targetIdx];
    if (!targetPage) return;

    setCurrentPageIndex(targetIdx);

    const el = document.getElementById(targetPage.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (direction) {
      setSwipeFeedback({
        direction,
        text: targetPage.shortTitle
      });
      setTimeout(() => setSwipeFeedback(null), 1600);
    }

    if (onPageChange) {
      onPageChange(targetIdx, targetPage.id);
    }
  }, [onPageChange]);

  const goToPrevPage = useCallback(() => {
    if (currentPageIndex > 0) {
      navigateToPage(currentPageIndex - 1, 'back');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setSwipeFeedback({ direction: 'back', text: 'Top of Studio' });
      setTimeout(() => setSwipeFeedback(null), 1400);
    }
  }, [currentPageIndex, navigateToPage]);

  const goToNextPage = useCallback(() => {
    if (currentPageIndex < APP_PAGES.length - 1) {
      navigateToPage(currentPageIndex + 1, 'next');
    } else {
      setSwipeFeedback({ direction: 'next', text: 'End of Studio' });
      setTimeout(() => setSwipeFeedback(null), 1400);
    }
  }, [currentPageIndex, navigateToPage]);

  // Track active page via IntersectionObserver
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const idx = APP_PAGES.findIndex(p => p.id === entry.target.id);
          if (idx !== -1) {
            setCurrentPageIndex(idx);
          }
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.35,
      rootMargin: '-80px 0px -40% 0px'
    });

    APP_PAGES.forEach(page => {
      const el = document.getElementById(page.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Listen for custom menu page jumps
  useEffect(() => {
    const handleMenuNav = (e: Event) => {
      const customEv = e as CustomEvent<{ targetId: string }>;
      if (customEv && customEv.detail && customEv.detail.targetId) {
        const idx = APP_PAGES.findIndex(p => p.id === customEv.detail.targetId);
        if (idx !== -1) {
          setCurrentPageIndex(idx);
        }
      }
    };
    window.addEventListener('crochet-menu-page-clicked', handleMenuNav as EventListener);
    return () => window.removeEventListener('crochet-menu-page-clicked', handleMenuNav as EventListener);
  }, []);

  // Touch Swipe Event Listeners:
  // User request: "enable left swipe to be back and right for next for seemless navigation."
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Ignore if user is interacting with form inputs, sliders, or modals
      const target = e.target as HTMLElement;
      if (
        target.closest('input') || 
        target.closest('select') || 
        target.closest('textarea') ||
        target.closest('#transformation-slider-range') ||
        target.closest('.fixed.inset-0') // Inside modals
      ) {
        touchStartPos.current = null;
        return;
      }

      if (e.touches && e.touches.length === 1) {
        touchStartPos.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now()
        };
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartPos.current) return;
      if (!e.changedTouches || e.changedTouches.length === 0) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - touchStartPos.current.x;
      const deltaY = endY - touchStartPos.current.y;
      const timeElapsed = Date.now() - touchStartPos.current.time;

      touchStartPos.current = null;

      // Minimum swipe distance is 100px, max time 600ms, and must be strictly horizontal (2.2x vertical)
      const isHorizontalSwipe = Math.abs(deltaX) > 100 && Math.abs(deltaX) > Math.abs(deltaY) * 2.2 && timeElapsed < 600;

      if (isHorizontalSwipe) {
        // User explicit instruction: "enable left swipe to be back and right for next for seemless navigation"
        if (deltaX < -55) {
          // Finger dragged to the LEFT (Left Swipe) -> Navigate BACK
          goToPrevPage();
        } else if (deltaX > 55) {
          // Finger dragged to the RIGHT (Right Swipe) -> Navigate NEXT
          goToNextPage();
        }
      }
    };

    // Keyboard navigation (ArrowLeft = Back, ArrowRight = Next)
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      if (e.key === 'ArrowLeft') {
        goToPrevPage();
      } else if (e.key === 'ArrowRight') {
        goToNextPage();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToPrevPage, goToNextPage]);

  const currentPage = APP_PAGES[currentPageIndex] || APP_PAGES[0];

  return (
    <>
      {/* Floating Swipe Gesture Notification Toast */}
      {swipeFeedback && (
        <div 
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-2xl bg-black/90 border border-amber-400/80 text-white text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200"
          role="status"
          aria-live="polite"
        >
          {swipeFeedback.direction === 'back' ? (
            <ArrowLeft className="w-4 h-4 text-amber-400" />
          ) : (
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          )}
          <span>{swipeFeedback.text}</span>
        </div>
      )}

      {/* Sleek Floating Bottom Navigation Controller Bar - visible on tablets and desktop */}
      <div 
        id="seamless-swipe-navigation-pill"
        className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 max-w-[calc(100vw-1.5rem)] sm:max-w-md w-full px-2 pointer-events-auto hidden md:block"
      >
        <div className="relative rounded-2xl bg-[#09120c]/92 backdrop-blur-xl border border-emerald-500/35 px-3 py-2 shadow-2xl shadow-black/80 flex items-center justify-between gap-2 text-xs">
          
          {/* Previous Section Button */}
          <button
            id="swipe-nav-back-btn"
            onClick={goToPrevPage}
            disabled={currentPageIndex === 0}
            className={`p-2 rounded-xl flex items-center justify-center font-bold transition-all cursor-pointer select-none active:scale-95 ${
              currentPageIndex === 0
                ? 'opacity-30 cursor-not-allowed text-stone-600'
                : 'bg-[#122216] hover:bg-[#1a3321] text-amber-300 border border-amber-500/30'
            }`}
            title="Previous section"
          >
            <ChevronLeft className="w-4 h-4 text-amber-400" />
          </button>

          {/* Current Section Title & Progress Dots */}
          <div className="flex flex-col items-center justify-center px-2 min-w-0 flex-1 text-center">
            <span className="text-[12px] font-extrabold text-stone-100 truncate max-w-[180px] sm:max-w-[240px] tracking-wide font-syne">
              {currentPage.shortTitle}
            </span>
            <div className="flex items-center gap-1 mt-1">
              {APP_PAGES.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => navigateToPage(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentPageIndex 
                      ? 'w-5 bg-gradient-to-r from-amber-400 to-emerald-400 shadow-sm shadow-amber-400/50' 
                      : 'w-1.5 bg-stone-700 hover:bg-stone-500'
                  }`}
                  title={p.shortTitle}
                />
              ))}
            </div>
          </div>

          {/* Next Section Button */}
          <button
            id="swipe-nav-next-btn"
            onClick={goToNextPage}
            disabled={currentPageIndex === APP_PAGES.length - 1}
            className={`p-2 rounded-xl flex items-center justify-center font-bold transition-all cursor-pointer select-none active:scale-95 ${
              currentPageIndex === APP_PAGES.length - 1
                ? 'opacity-30 cursor-not-allowed text-stone-600'
                : 'bg-[#122216] hover:bg-[#1a3321] text-emerald-300 border border-emerald-500/30'
            }`}
            title="Next section"
          >
            <ChevronRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>
    </>
  );
};
