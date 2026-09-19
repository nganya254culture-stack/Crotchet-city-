import React from 'react';

interface BackToTopBarProps {
  currentSectionName?: string;
}

export const BackToTopBar: React.FC<BackToTopBarProps> = () => {
  // Rendered cleanly as an empty fragment to eliminate redundant bottom button clutter
  return null;
};
