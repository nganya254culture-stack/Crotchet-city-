// Centralized Media & Gallery Registry for Crochet City
// Supports Local Media (IndexedDB for large photos/videos without localStorage 5MB quota limits)
// and Remote URLs (Cloudinary, Imgur, Supabase, YouTube, direct MP4/JPG)

export interface MediaItem {
  id: string;
  title: string;
  category: 'background' | 'transformation' | 'showcase' | 'team' | 'video';
  url: string;
  thumbnail?: string;
  type: 'image' | 'video';
  description?: string;
  addedAt?: string;
  fileSizeFormatted?: string;
  isBlob?: boolean;
}

// Clean default fallback background (Zero unwanted previous media)
export const DEFAULT_BACKGROUND_PHOTO = "https://images.unsplash.com/photo-1584297091622-af8e5bd9c086?auto=format&fit=crop&w=2000&q=85";
export const ALTERNATE_BACKGROUND_PHOTO = "https://images.unsplash.com/photo-1584297091622-af8e5bd9c086?auto=format&fit=crop&w=2000&q=85";

// Curated Authentic Studio Media Gallery for Crochet City
// Reflecting Master P's real sessions: Diamond scalp grids, needle interlocking in blue jacket,
// dynamic loc shake tests, and scenic outdoor mature loc restoration
export const PRESET_GALLERY: MediaItem[] = [
  {
    id: 'media-diamond-grid',
    title: 'Diamond & Brick Scalp Grid Parting',
    category: 'transformation',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1584297091622-af8e5bd9c086?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1584297091622-af8e5bd9c086?auto=format&fit=crop&w=400&q=80',
    description: 'Immaculate overhead inspection: neat geometric scalp parting without loose flyaways, zero wax, healthy root spacing allowing natural skin respiration.',
    addedAt: 'Authentic Studio Session'
  },
  {
    id: 'media-master-p-needle',
    title: 'P The Dread Genius Micro-Needle Interlocking',
    category: 'team',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    description: 'P The Dread Genius sculpting roots using a 0.5mm micro-crochet hook. Gentle, painless, wax-free interlocking for young crowns and mature locs.',
    addedAt: 'Master Loctician Studio'
  },
  {
    id: 'media-shake-test-video',
    title: 'The Signature "Loc Shake Test" (Full Bouncy Freedom)',
    category: 'video',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-shaking-her-curly-hair-41444-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    description: 'Instant pain-free mobility: watch the client vigorously shaking their head right after the session. Lightweight, flexible, with 0% heavy wax pull.',
    addedAt: 'Mobility Verification'
  },
  {
    id: 'media-outdoor-mature-hillside',
    title: 'Scenic Hillside Overlook: Mature Dreadlocks in Sunlight',
    category: 'showcase',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    description: 'Rear view in natural daylight: deep clean scalp rows, dense architectural dreadlock cylinders, organic tea tree and jojoba sheen.',
    addedAt: 'Outdoor Mastery Session'
  },
  {
    id: 'media-scenic-wind-video',
    title: 'Mature Locs Motion & Natural Breeze Test',
    category: 'video',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-african-american-man-posing-outdoors-42289-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    description: 'Natural movement in open air without artificial stiffeners or edge waxes. Every dreadlock moves with organic flow.',
    addedAt: 'Scenic Nairobi Hillside'
  },
  {
    id: 'media-scalp-health-detail',
    title: 'Wax-Free Scalp Breathing & Follicle Detail',
    category: 'transformation',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    description: 'Close inspection of clean scalp skin between roots. 100% free of grey lint, white flakes, or heavy beeswax build-up.',
    addedAt: 'Scalp Health Inspection'
  }
];

const STORAGE_BG_KEY = 'crochet_city_custom_bg';
const STORAGE_MEDIA_KEY = 'crochet_city_custom_media';
const STORAGE_OVERRIDES_KEY = 'crochet_city_photo_overrides';
const DB_NAME = 'CrochetCityMediaDB';
const DB_VERSION = 2;
const STORE_NAME = 'mediaItems';
const STORE_OVERRIDES = 'photoOverrides';

export interface ActiveBackgroundState {
  url: string;
  type: 'image' | 'video';
}

export interface PhotoOverrideRecord {
  key: string;
  url: string;
  title?: string;
  updatedAt: number;
}

// In-memory runtime cache for synchronous instant rendering
let runtimeMediaCache: MediaItem[] = [];
let runtimeOverridesCache: Record<string, string> = {};
let isDbInitialized = false;
let isOverridesInitialized = false;

// Initialize IndexedDB for high-capacity media and photo overrides storage
function openMediaDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_OVERRIDES)) {
        db.createObjectStore(STORE_OVERRIDES, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Load all media items from IndexedDB + localStorage fallback
export async function loadAllMediaAsync(): Promise<MediaItem[]> {
  if (typeof window === 'undefined') return [];

  const items: MediaItem[] = [];

  try {
    const db = await openMediaDatabase();
    await new Promise<void>((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        if (Array.isArray(request.result)) {
          items.push(...request.result);
        }
        resolve();
      };
      request.onerror = () => resolve();
    });
  } catch (e) {
    console.warn('IndexedDB retrieval note:', e);
  }

  // Fallback to localStorage if any lightweight links were saved
  try {
    const local = window.localStorage ? window.localStorage.getItem(STORAGE_MEDIA_KEY) : null;
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (!items.some(existing => existing.id === item.id)) {
            items.push(item);
          }
        }
      }
    }
  } catch (e) {
    console.warn('localStorage retrieval note:', e);
  }

  runtimeMediaCache = items;
  isDbInitialized = true;
  return items;
}

// Synchronous getter for instant UI renders
export function getCustomMediaList(): MediaItem[] {
  if (typeof window === 'undefined') return [];
  if (runtimeMediaCache.length > 0) return runtimeMediaCache;

  // Initial read from localStorage while async DB initializes
  try {
    if (window.localStorage) {
      const saved = window.localStorage.getItem(STORAGE_MEDIA_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          runtimeMediaCache = parsed;
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('Sync media read note:', e);
  }

  // Kick off async DB load in background
  if (!isDbInitialized) {
    loadAllMediaAsync().then(() => {
      window.dispatchEvent(new CustomEvent('crochet-media-updated'));
    });
  }

  return runtimeMediaCache;
}

// Combined getter for presets + custom items
export function getAllMediaItems(): MediaItem[] {
  const custom = getCustomMediaList();
  const combined = [...custom, ...PRESET_GALLERY];
  // Deduplicate by id
  const seen = new Set<string>();
  return combined.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

// Add a new media item with IndexedDB persistence
export async function addCustomMediaItemAsync(item: Omit<MediaItem, 'id' | 'addedAt'>): Promise<MediaItem> {
  const newItem: MediaItem = {
    ...item,
    id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    addedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  };

  // Add to runtime cache immediately
  runtimeMediaCache.unshift(newItem);

  // Persist to IndexedDB
  try {
    const db = await openMediaDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.put(newItem);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed, trying localStorage fallback:', err);
  }

  // Also keep lightweight metadata in localStorage if URL is not a giant base64 string
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      if (!newItem.url.startsWith('data:') || newItem.url.length < 500000) {
        const existing = window.localStorage.getItem(STORAGE_MEDIA_KEY);
        let list: MediaItem[] = [];
        if (existing) {
          try {
            list = JSON.parse(existing);
          } catch {
            list = [];
          }
        }
        list.unshift(newItem);
        // Keep max 20 items in localStorage to stay far below 5MB limit
        window.localStorage.setItem(STORAGE_MEDIA_KEY, JSON.stringify(list.slice(0, 20)));
      }
    } catch (e) {
      console.warn('localStorage quota note (saved in IndexedDB instead):', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('crochet-media-updated', { detail: newItem }));
    } catch (e) {
      console.warn('Event dispatch note:', e);
    }
  }

  return newItem;
}

// Synchronous wrapper
export function addCustomMediaItem(item: Omit<MediaItem, 'id' | 'addedAt'>): MediaItem {
  const newItem: MediaItem = {
    ...item,
    id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    addedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  };

  runtimeMediaCache.unshift(newItem);
  addCustomMediaItemAsync(item).catch(err => console.warn('addCustomMediaItemAsync error:', err));
  return newItem;
}

// Delete a single media item
export async function deleteMediaItemAsync(id: string): Promise<boolean> {
  runtimeMediaCache = runtimeMediaCache.filter(item => item.id !== id);

  try {
    const db = await openMediaDatabase();
    await new Promise<void>((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('IndexedDB delete note:', err);
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const local = window.localStorage.getItem(STORAGE_MEDIA_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(item => item.id !== id);
          window.localStorage.setItem(STORAGE_MEDIA_KEY, JSON.stringify(filtered));
        }
      }
    } catch (e) {
      console.warn('localStorage delete note:', e);
    }
    window.dispatchEvent(new CustomEvent('crochet-media-updated'));
  }

  return true;
}

// Delete ALL previous media (clean purge)
export async function clearAllMedia(): Promise<void> {
  runtimeMediaCache = [];

  try {
    const db = await openMediaDatabase();
    await new Promise<void>((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('IndexedDB clear note:', err);
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(STORAGE_MEDIA_KEY);
      window.localStorage.removeItem(STORAGE_BG_KEY);
    } catch (e) {
      console.warn('localStorage clear note:', e);
    }
    window.dispatchEvent(new CustomEvent('crochet-media-updated'));
    window.dispatchEvent(new CustomEvent('crochet-bg-changed', { 
      detail: { url: DEFAULT_BACKGROUND_PHOTO, type: 'image' } 
    }));
  }
}

// Background photo controls
export function getActiveBackground(): ActiveBackgroundState {
  const fallback: ActiveBackgroundState = { url: DEFAULT_BACKGROUND_PHOTO, type: 'image' };
  if (typeof window === 'undefined') return fallback;

  try {
    const saved = window.localStorage ? window.localStorage.getItem(STORAGE_BG_KEY) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'string' && parsed.trim().length > 0) {
          return { url: parsed.trim(), type: 'image' };
        }
        if (parsed && typeof parsed === 'object' && typeof parsed.url === 'string' && parsed.url.trim().length > 0) {
          return {
            url: parsed.url.trim(),
            type: parsed.type === 'video' ? 'video' : 'image',
          };
        }
      } catch {
        if (typeof saved === 'string' && (saved.startsWith('http') || saved.startsWith('/') || saved.startsWith('data:') || saved.startsWith('blob:'))) {
          return { url: saved.trim(), type: 'image' };
        }
      }
    }
  } catch (e) {
    console.warn('Unable to retrieve background:', e);
  }
  return fallback;
}

export function setActiveBackground(url: string, type: 'image' | 'video' = 'image') {
  if (typeof window === 'undefined') return;
  const safeItem: ActiveBackgroundState = {
    url: (url && typeof url === 'string' && url.trim().length > 0) ? url.trim() : DEFAULT_BACKGROUND_PHOTO,
    type: type === 'video' ? 'video' : 'image',
  };
  try {
    if (window.localStorage) {
      window.localStorage.setItem(STORAGE_BG_KEY, JSON.stringify(safeItem));
    }
  } catch (e) {
    console.warn('Unable to persist background to localStorage:', e);
  }

  try {
    window.dispatchEvent(new CustomEvent('crochet-bg-changed', { detail: safeItem }));
  } catch (e) {
    console.warn('Unable to dispatch crochet-bg-changed:', e);
  }
}

export function resetActiveBackground() {
  if (typeof window === 'undefined') return;
  const fallback: ActiveBackgroundState = { url: DEFAULT_BACKGROUND_PHOTO, type: 'image' };
  try {
    if (window.localStorage) {
      window.localStorage.removeItem(STORAGE_BG_KEY);
    }
  } catch (e) {
    console.warn('Unable to remove background from localStorage:', e);
  }

  try {
    window.dispatchEvent(new CustomEvent('crochet-bg-changed', { detail: fallback }));
  } catch (e) {
    console.warn('Unable to dispatch crochet-bg-changed:', e);
  }
}

// ---------------------------------------------------------------------------
// INDIVIDUAL PHOTO REPLACEMENT & OVERRIDE PERSISTENCE ENGINE
// Allows any photo across the site (showcase, transformations, team, services)
// to be replaced directly on the preview and persistently saved into IndexedDB.
// ---------------------------------------------------------------------------

// Load all photo overrides from IndexedDB + localStorage fallback
export async function loadAllPhotoOverridesAsync(): Promise<Record<string, string>> {
  if (typeof window === 'undefined') return {};

  const map: Record<string, string> = {};

  try {
    const db = await openMediaDatabase();
    await new Promise<void>((resolve) => {
      const transaction = db.transaction([STORE_OVERRIDES], 'readonly');
      const store = transaction.objectStore(STORE_OVERRIDES);
      const request = store.getAll();
      request.onsuccess = () => {
        if (Array.isArray(request.result)) {
          for (const item of request.result) {
            if (item && item.key && item.url) {
              map[item.key] = item.url;
            }
          }
        }
        resolve();
      };
      request.onerror = () => resolve();
    });
  } catch (e) {
    console.warn('IndexedDB photo overrides read note:', e);
  }

  // Fallback to localStorage
  try {
    const saved = window.localStorage ? window.localStorage.getItem(STORAGE_OVERRIDES_KEY) : null;
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        for (const [k, v] of Object.entries(parsed)) {
          if (typeof v === 'string' && !map[k]) {
            map[k] = v;
          }
        }
      }
    }
  } catch (e) {
    console.warn('localStorage photo overrides read note:', e);
  }

  runtimeOverridesCache = map;
  isOverridesInitialized = true;
  return map;
}

// Synchronous getter for photo override
export function getPhotoOverride(keyOrUrl: string): string | null {
  if (typeof window === 'undefined' || !keyOrUrl) return null;

  // Initialize from localStorage immediately if memory empty
  if (!isOverridesInitialized && Object.keys(runtimeOverridesCache).length === 0) {
    try {
      if (window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_OVERRIDES_KEY);
        if (saved) {
          runtimeOverridesCache = JSON.parse(saved) || {};
        }
      }
    } catch {}
    loadAllPhotoOverridesAsync().then(() => {
      window.dispatchEvent(new CustomEvent('crochet-photo-replaced', { detail: { keyOrUrl: 'all' } }));
    });
  }

  return runtimeOverridesCache[keyOrUrl] || null;
}

// Returns the replaced photo if one exists, otherwise returns the original/default URL
export function getEffectivePhoto(originalUrl: string, keyId?: string): string {
  if (keyId) {
    const byKey = getPhotoOverride(keyId);
    if (byKey) return byKey;
  }
  if (originalUrl) {
    const byUrl = getPhotoOverride(originalUrl);
    if (byUrl) return byUrl;
  }
  return originalUrl;
}

// Get all active overrides
export function getAllPhotoOverrides(): Record<string, string> {
  return { ...runtimeOverridesCache };
}

// Check if a photo has an active replacement
export function hasPhotoOverride(keyOrUrl: string): boolean {
  return !!getPhotoOverride(keyOrUrl);
}

// Save a photo replacement with IndexedDB and localStorage persistence
export async function savePhotoOverrideAsync(
  keyOrUrl: string, 
  newUrl: string, 
  title?: string
): Promise<void> {
  if (!keyOrUrl || !newUrl) return;

  const record: PhotoOverrideRecord = {
    key: keyOrUrl,
    url: newUrl,
    title,
    updatedAt: Date.now()
  };

  // Immediate runtime cache update
  runtimeOverridesCache[keyOrUrl] = newUrl;

  // Persist into IndexedDB
  try {
    const db = await openMediaDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_OVERRIDES], 'readwrite');
      const store = transaction.objectStore(STORE_OVERRIDES);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB photo override save note:', err);
  }

  // Also sync to localStorage for lightweight instant hydration
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_OVERRIDES_KEY, JSON.stringify(runtimeOverridesCache));
    } catch (e) {
      console.warn('localStorage override quota note:', e);
    }
  }

  // Dispatch event so all components reactively re-render instantly
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('crochet-photo-replaced', {
      detail: { keyOrUrl, newUrl, title }
    }));
  }
}

// Remove an override and revert to original photo
export async function removePhotoOverrideAsync(keyOrUrl: string): Promise<void> {
  if (!keyOrUrl) return;

  delete runtimeOverridesCache[keyOrUrl];

  try {
    const db = await openMediaDatabase();
    await new Promise<void>((resolve) => {
      const transaction = db.transaction([STORE_OVERRIDES], 'readwrite');
      const store = transaction.objectStore(STORE_OVERRIDES);
      const req = store.delete(keyOrUrl);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('IndexedDB delete override note:', err);
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_OVERRIDES_KEY, JSON.stringify(runtimeOverridesCache));
    } catch {}
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('crochet-photo-replaced', {
      detail: { keyOrUrl, newUrl: null, reverted: true }
    }));
  }
}

// Update existing MediaItem directly (for gallery items)
export async function updateMediaItemAsync(id: string, updates: Partial<MediaItem>): Promise<MediaItem | null> {
  let item = runtimeMediaCache.find(it => it.id === id);
  
  if (!item) {
    const preset = PRESET_GALLERY.find(it => it.id === id);
    if (preset) {
      item = { ...preset, ...updates };
      runtimeMediaCache.unshift(item);
    }
  } else {
    Object.assign(item, updates);
  }

  if (!item) return null;

  try {
    const db = await openMediaDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('IndexedDB update media item error:', e);
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const existing = window.localStorage.getItem(STORAGE_MEDIA_KEY);
      let list: MediaItem[] = existing ? JSON.parse(existing) : [];
      const idx = list.findIndex(it => it.id === id);
      if (idx >= 0) {
        list[idx] = item;
      } else {
        list.unshift(item);
      }
      window.localStorage.setItem(STORAGE_MEDIA_KEY, JSON.stringify(list.slice(0, 25)));
    } catch {}
  }

  // Also record in photo overrides map so any direct URL references get updated
  if (updates.url) {
    savePhotoOverrideAsync(id, updates.url, updates.title).catch(() => {});
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('crochet-media-updated', { detail: item }));
  }

  return item;
}

