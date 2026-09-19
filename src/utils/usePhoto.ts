import { useState, useEffect } from 'react';
import { getEffectivePhoto } from '../data/mediaGallery';

/**
 * Custom React hook to retrieve the effective photo for any key or default URL.
 * Automatically synchronizes whenever a user replaces any photo across the application.
 */
export function usePhoto(defaultUrl: string, keyId?: string): string {
  const [photoUrl, setPhotoUrl] = useState<string>(() => getEffectivePhoto(defaultUrl, keyId));

  useEffect(() => {
    // Initial sync
    setPhotoUrl(getEffectivePhoto(defaultUrl, keyId));

    const handlePhotoChanged = (e: Event) => {
      try {
        const customEv = e as CustomEvent<{ keyOrUrl?: string; newUrl?: string | null }>;
        if (customEv?.detail?.keyOrUrl) {
          if (
            customEv.detail.keyOrUrl === 'all' ||
            customEv.detail.keyOrUrl === keyId ||
            customEv.detail.keyOrUrl === defaultUrl
          ) {
            setPhotoUrl(getEffectivePhoto(defaultUrl, keyId));
          }
        } else {
          setPhotoUrl(getEffectivePhoto(defaultUrl, keyId));
        }
      } catch {
        setPhotoUrl(getEffectivePhoto(defaultUrl, keyId));
      }
    };

    window.addEventListener('crochet-photo-replaced', handlePhotoChanged as EventListener);
    window.addEventListener('crochet-media-updated', handlePhotoChanged as EventListener);

    return () => {
      window.removeEventListener('crochet-photo-replaced', handlePhotoChanged as EventListener);
      window.removeEventListener('crochet-media-updated', handlePhotoChanged as EventListener);
    };
  }, [defaultUrl, keyId]);

  return photoUrl;
}
