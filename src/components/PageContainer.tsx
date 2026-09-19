import React from 'react';

interface PageContainerProps {
  id: string;
  pageNumber?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  categoryBadge?: string;
  badgeIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  id,
  children,
  className = '',
}) => {
  return (
    <div 
      id={id} 
      className={`my-3 sm:my-5 mx-auto max-w-7xl px-3 sm:px-6 w-full scroll-mt-20 sm:scroll-mt-24 transition-all ${className}`}
    >
      {/* Discrete Section Card with Solid Luxury Dark Background */}
      <article className="relative rounded-3xl bg-[#0c140e] border border-[#1f3323] hover:border-emerald-600/30 transition-colors shadow-2xl shadow-black/80 overflow-hidden">
        {/* Subtle Rasta Accent ribbon across the top */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500" />

        {/* Content Body */}
        <div className="relative z-10">
          {children}
        </div>
      </article>
    </div>
  );
};
