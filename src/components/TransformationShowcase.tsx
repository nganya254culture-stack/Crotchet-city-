import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  Scissors, 
  Play, 
  Check, 
  AlertTriangle, 
  Compass, 
  Film, 
  RotateCcw,
  Zap,
  Image as ImageIcon,
  Video,
  Maximize2,
  Upload,
  Plus,
  Trash2,
  Layers,
  FolderOpen,
  Camera,
  RefreshCw
} from 'lucide-react';
import { TRANSFORMATIONS, FEATURED_VIDEOS } from '../data/crochetData';
import { 
  getAllMediaItems, 
  MediaItem, 
  setActiveBackground, 
  addCustomMediaItemAsync, 
  loadAllMediaAsync,
  deleteMediaItemAsync,
  getEffectivePhoto,
  loadAllPhotoOverridesAsync
} from '../data/mediaGallery';
import { BackToTopBar } from './BackToTopBar';
import { SectionBackToIndex } from './SectionBackToIndex';
import { ReplacePhotoModal } from './ReplacePhotoModal';

interface TransformationShowcaseProps {
  onBookService: (serviceName?: string) => void;
  onOpenUploadModal?: () => void;
}

export const TransformationShowcase: React.FC<TransformationShowcaseProps> = ({ 
  onBookService,
  onOpenUploadModal 
}) => {
  // Default to Before & After visualizer so the user immediately sees the transformations!
  const [activeTab, setActiveTab] = useState<'visualizer' | 'videos' | 'gallery'>('visualizer');
  const [activeIdx, setActiveIdx] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(FEATURED_VIDEOS[0]?.id || null);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>(() => getAllMediaItems());
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'image' | 'video'>('all');
  const [selectedMediaModal, setSelectedMediaModal] = useState<MediaItem | null>(null);
  const [backdropSetSuccess, setBackdropSetSuccess] = useState<string | null>(null);
  const [overrideRefreshTrigger, setOverrideRefreshTrigger] = useState(0);

  // Photo replacement modal state
  const [replaceModalState, setReplaceModalState] = useState<{
    isOpen: boolean;
    photoKey: string;
    currentPhotoUrl: string;
    originalDefaultUrl?: string;
    photoTitle?: string;
    mediaItemId?: string;
  }>({
    isOpen: false,
    photoKey: '',
    currentPhotoUrl: '',
  });

  const handleOpenReplaceModal = (
    photoKey: string,
    currentPhotoUrl: string,
    originalDefaultUrl?: string,
    photoTitle?: string,
    mediaItemId?: string
  ) => {
    setReplaceModalState({
      isOpen: true,
      photoKey,
      currentPhotoUrl,
      originalDefaultUrl: originalDefaultUrl || currentPhotoUrl,
      photoTitle: photoTitle || 'Studio Photo',
      mediaItemId,
    });
  };

  // Direct multi-file upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Synchronize and load items & overrides from IndexedDB
  useEffect(() => {
    loadAllMediaAsync().then(() => {
      setGalleryItems(getAllMediaItems());
    });
    loadAllPhotoOverridesAsync().then(() => {
      setOverrideRefreshTrigger((prev) => prev + 1);
    });

    const handleUpdate = () => {
      loadAllMediaAsync().then(() => {
        setGalleryItems(getAllMediaItems());
      });
    };

    const handlePhotoReplaced = () => {
      setOverrideRefreshTrigger((prev) => prev + 1);
      setGalleryItems(getAllMediaItems());
    };

    window.addEventListener('crochet-media-updated', handleUpdate);
    window.addEventListener('crochet-photo-replaced', handlePhotoReplaced);
    return () => {
      window.removeEventListener('crochet-media-updated', handleUpdate);
      window.removeEventListener('crochet-photo-replaced', handlePhotoReplaced);
    };
  }, []);

  const currentItem = TRANSFORMATIONS[activeIdx];
  const effectiveBeforeImg = getEffectivePhoto(currentItem.beforeImg, `trans-${currentItem.id}-before`);
  const effectiveAfterImg = getEffectivePhoto(currentItem.afterImg, `trans-${currentItem.id}-after`);

  const filteredGallery = galleryItems.filter(item => {
    if (galleryFilter === 'all') return true;
    return item.type === galleryFilter;
  });

  const handleSetBackdrop = (item: MediaItem) => {
    setActiveBackground(item.url, item.type);
    setBackdropSetSuccess(item.id);
    setTimeout(() => setBackdropSetSuccess(null), 2000);
  };

  const handleDeleteMedia = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this item from your gallery?')) {
      await deleteMediaItemAsync(id);
      await loadAllMediaAsync();
      setGalleryItems(getAllMediaItems());
    }
  };

  // Direct multi-file upload handler
  const handleDirectFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadStatus('Processing and saving files to your gallery...');

    let count = 0;
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVideo = file.type.startsWith('video/');
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        await addCustomMediaItemAsync({
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
          category: isVideo ? 'video' : 'showcase',
          url: dataUrl,
          type: isVideo ? 'video' : 'image',
          description: `Uploaded directly from device: ${file.name} (${sizeMb} MB)`,
          fileSizeFormatted: `${sizeMb} MB`
        });
        count++;
      }

      await loadAllMediaAsync();
      setGalleryItems(getAllMediaItems());
      setUploadStatus(`Success! Added ${count} file${count > 1 ? 's' : ''} directly to your studio gallery.`);
      setTimeout(() => setUploadStatus(null), 4000);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus('Could not read some files. If files are very large (>50MB), try uploading via hosted URL.');
      setTimeout(() => setUploadStatus(null), 5000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <section id="transformations-section" className="py-6 sm:py-10 bg-transparent relative">
      {/* Hidden Multi-file input for instant direct upload */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleDirectFilesUpload}
        className="hidden"
        id="gallery-direct-file-input"
      />

      {/* Subtle Rasta Accent background gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-15 bg-gradient-to-r from-emerald-950 via-transparent to-red-950" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Navigation Breadcrumb Bar */}
        <SectionBackToIndex sectionTitle="Studio Gallery & Transformations" categoryBadge="Authentic Media" />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Master P's Work Showcase
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-cinzel tracking-tight">
            Before & After Showcase, Videos & Photos
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
            Witness the proof of neatness: interactive before & after comparisons, dynamic Head-Shake test videos, and verified client sessions by <span className="text-amber-400 font-semibold">P The dread genius</span>.
          </p>
        </div>

        {/* Action Showcase Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-[#0a110c] p-2 sm:p-3 rounded-2xl border border-emerald-900/40 shadow-2xl">
          <div className="inline-flex p-1 rounded-xl bg-[#0e1710] border border-[#1b2b1e] flex-wrap justify-center gap-1 w-full sm:w-auto">
            <button
              id="tab-interactive-slider"
              onClick={() => setActiveTab('visualizer')}
              className={`px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'visualizer'
                  ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 text-stone-950 shadow-md shadow-emerald-950/60'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Before & After Showcase ({TRANSFORMATIONS.length})</span>
            </button>
            <button
              id="tab-video-action"
              onClick={() => setActiveTab('videos')}
              className={`px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'videos'
                  ? 'bg-gradient-to-r from-red-700 to-red-600 text-white shadow-md shadow-red-950/60'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4 text-amber-400" />
              <span>Action Videos ({FEATURED_VIDEOS.length})</span>
            </button>
            <button
              id="tab-studio-gallery"
              onClick={() => setActiveTab('gallery')}
              className={`px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'gallery'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-950/60'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Studio Photos ({galleryItems.length})</span>
            </button>
          </div>

          {/* Direct Upload CTA Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              id="btn-direct-device-upload"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              title="Select photos or videos from your phone/computer"
            >
              <Upload className="w-3.5 h-3.5 text-amber-300" />
              <span>{isUploading ? 'Uploading...' : 'Upload Photos / Videos'}</span>
            </button>

            {onOpenUploadModal && (
              <button
                id="btn-open-vault-manager"
                onClick={onOpenUploadModal}
                className="px-3 py-2 rounded-xl bg-[#132217] hover:bg-[#1a3321] text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Manage gallery, delete items, or add external URLs"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Vault Manager</span>
              </button>
            )}
          </div>
        </div>

        {/* Upload Status Banner */}
        {uploadStatus && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs font-medium flex items-center justify-between shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{uploadStatus}</span>
            </div>
            <button 
              onClick={() => setUploadStatus(null)}
              className="text-stone-400 hover:text-white font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* TAB 1: AUTHENTIC STUDIO MEDIA GALLERY (PRIMARY) */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Gallery Filter & Upload Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1610] p-3 rounded-2xl border border-[#213526]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGalleryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    galleryFilter === 'all'
                      ? 'bg-amber-400 text-stone-950 shadow-sm'
                      : 'bg-[#152319] text-stone-300 hover:text-white'
                  }`}
                >
                  All Media ({galleryItems.length})
                </button>
                <button
                  onClick={() => setGalleryFilter('image')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    galleryFilter === 'image'
                      ? 'bg-amber-400 text-stone-950 shadow-sm'
                      : 'bg-[#152319] text-stone-300 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Photos ({galleryItems.filter(i => i.type === 'image').length})</span>
                </button>
                <button
                  onClick={() => setGalleryFilter('video')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    galleryFilter === 'video'
                      ? 'bg-amber-400 text-stone-950 shadow-sm'
                      : 'bg-[#152319] text-stone-300 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Videos ({galleryItems.filter(i => i.type === 'video').length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-300">
                <span className="hidden sm:inline">Tap any item to inspect or apply as website wallpaper</span>
              </div>
            </div>

            {/* Gallery Media Grid */}
            {filteredGallery.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-3xl bg-[#0d1610] border border-stone-800 space-y-4">
                <ImageIcon className="w-12 h-12 text-stone-600 mx-auto" />
                <h4 className="text-lg font-bold text-white">No media found in this filter</h4>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  Tap the button below to upload your studio photos and videos directly from your device.
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xs font-bold cursor-pointer"
                >
                  Upload Photos / Videos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredGallery.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl bg-[#0d1610] border border-[#213526] hover:border-emerald-500/60 transition-all overflow-hidden shadow-xl flex flex-col"
                  >
                    {/* Media Visual Area */}
                    <div 
                      className="relative aspect-[4/3] bg-black overflow-hidden cursor-pointer" 
                      onClick={() => setSelectedMediaModal(item)}
                    >
                      {item.type === 'video' ? (
                        <video
                          src={item.url}
                          poster={item.thumbnail}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          muted
                          loop
                          playsInline
                          onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                          onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      )}

                      {/* Type Badge */}
                      <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/80 backdrop-blur-sm text-stone-200 text-[10px] font-extrabold uppercase border border-stone-700 flex items-center gap-1">
                        {item.type === 'video' ? <Video className="w-3 h-3 text-red-400" /> : <ImageIcon className="w-3 h-3 text-emerald-400" />}
                        <span>{item.type}</span>
                      </div>

                      {/* Delete button for uploaded items */}
                      <button
                        onClick={(e) => handleDeleteMedia(e, item.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-md bg-black/80 hover:bg-red-950 text-stone-400 hover:text-red-400 border border-stone-700 transition-colors z-10 cursor-pointer"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Hover Inspect Icon */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg">
                          <Maximize2 className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Media Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="text-sm font-extrabold text-white font-syne group-hover:text-amber-300 transition-colors truncate">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed font-light">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#1b2a1e] gap-1.5 text-xs">
                        <button
                          onClick={() => setSelectedMediaModal(item)}
                          className="text-stone-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>Inspect</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenReplaceModal(item.id, item.url, item.url, item.title, item.id)}
                            className="px-2 py-1 rounded-lg bg-[#152319] hover:bg-[#1f3825] text-amber-300 hover:text-amber-200 border border-amber-500/30 text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1"
                            title="Replace this individual photo"
                          >
                            <Camera className="w-3 h-3 text-amber-400" />
                            <span>Replace</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSetBackdrop(item)}
                            className="px-2.5 py-1 rounded-lg bg-[#142618] hover:bg-[#1c3823] text-emerald-300 border border-emerald-500/30 text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1"
                          >
                            {backdropSetSuccess === item.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Applied!</span>
                              </>
                            ) : (
                              <span>Set Wallpaper</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INTERACTIVE BEFORE / AFTER VISUALIZER */}
        {activeTab === 'visualizer' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Transformation Case Selector Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {TRANSFORMATIONS.map((item, index) => (
                <button
                  key={item.id}
                  id={`trans-case-btn-${index}`}
                  onClick={() => {
                    setActiveIdx(index);
                    setSliderPosition(50);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    activeIdx === index
                      ? 'bg-gradient-to-r from-[#14532d] to-[#15803d] text-white border border-emerald-500/60 shadow-md shadow-emerald-950/50'
                      : 'bg-[#121a14] text-stone-400 hover:text-stone-200 border border-[#1e2a20] hover:bg-[#18231b]'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${activeIdx === index ? 'bg-amber-400 animate-pulse' : 'bg-stone-600'}`} />
                  <span className="truncate max-w-[220px] sm:max-w-none">{item.title}</span>
                </button>
              ))}
            </div>

            {/* Main Showcase Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0e1410] p-4 sm:p-8 rounded-3xl border border-[#213024] shadow-2xl">
              {/* Left Column: Interactive Before/After Visualizer */}
              <div className="lg:col-span-7">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] sm:aspect-[16/10] select-none border border-[#26372a]">
                  {/* After Image (Full background) */}
                  <img
                    src={effectiveAfterImg}
                    alt="After neat dreadlocks"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  
                  {/* After Label Badge - Clickable to replace photo */}
                  <div className="absolute top-4 right-4 z-20">
                    <button
                      type="button"
                      onClick={() => handleOpenReplaceModal(
                        `trans-${currentItem.id}-after`,
                        effectiveAfterImg,
                        currentItem.afterImg,
                        `${currentItem.title} (After Photo)`
                      )}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 text-xs font-extrabold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1.5 shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
                      title="Click to replace this After photo"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>After: Neat & Kept</span>
                      <Camera className="w-3.5 h-3.5 text-amber-400 ml-1" />
                    </button>
                  </div>

                  {/* Before Image (Clipped by slider position) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <img
                      src={effectiveBeforeImg}
                      alt="Before unkept dreadlocks"
                      className="absolute inset-0 w-full h-full object-cover object-center max-w-none"
                      style={{ width: '100%', minWidth: '100%' }}
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <button
                        type="button"
                        onClick={() => handleOpenReplaceModal(
                          `trans-${currentItem.id}-before`,
                          effectiveBeforeImg,
                          currentItem.beforeImg,
                          `${currentItem.title} (Before Photo)`
                        )}
                        className="px-3 py-1.5 rounded-lg bg-red-950/90 hover:bg-red-900 text-red-300 border border-red-700/60 text-xs font-extrabold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1.5 shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
                        title="Click to replace this Before photo"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        <span>Before: Unkept</span>
                        <Camera className="w-3.5 h-3.5 text-amber-400 ml-1" />
                      </button>
                    </div>
                  </div>

                  {/* Vertical Divider Line & Draggable Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 via-white to-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] z-30 pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-stone-950 border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-2xl">
                      <Compass className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Range Input for Smooth Control */}
                  <input
                    id="transformation-slider-range"
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-ew-resize z-40 w-full h-full"
                    aria-label="Before and after comparison slider"
                  />
                </div>

                {/* Direct Photo Replacement Toolbar */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-[#09110b] border border-[#1e2f22]">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenReplaceModal(
                        `trans-${currentItem.id}-before`,
                        effectiveBeforeImg,
                        currentItem.beforeImg,
                        `${currentItem.title} (Before Photo)`
                      )}
                      className="px-3 py-1.5 rounded-xl bg-[#1c1414] hover:bg-[#2c1919] text-red-300 hover:text-white border border-red-800/70 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5 text-red-400" />
                      <span>Replace "Before" Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenReplaceModal(
                        `trans-${currentItem.id}-after`,
                        effectiveAfterImg,
                        currentItem.afterImg,
                        `${currentItem.title} (After Photo)`
                      )}
                      className="px-3 py-1.5 rounded-xl bg-[#102415] hover:bg-[#183921] text-emerald-300 hover:text-white border border-emerald-700/70 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Replace "After" Photo</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-stone-400 hidden sm:inline-block">
                    Tap to swap with camera or phone photo
                  </span>
                </div>
              </div>

              {/* Right Column: Transformation Narrative */}
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                      Case #{activeIdx + 1}
                    </span>
                    {currentItem.shakeTestPassed && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400" />
                        Shake Test Passed
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 font-syne">
                    {currentItem.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Client: <span className="text-stone-200 font-medium">{currentItem.clientName}</span> • Stylist: <span className="text-amber-300 font-bold">{currentItem.loctician}</span>
                  </p>
                </div>

                {/* Direct Before vs After Comparison Cards */}
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-[#141814] border border-red-950/50">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wide">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Before: Unkept State</span>
                    </div>
                    <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                      {currentItem.beforeDescription}
                    </p>
                    {currentItem.beforeTraits && (
                      <ul className="mt-2 space-y-1 text-[11px] text-stone-400">
                        {currentItem.beforeTraits.map((trait, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-1.5">
                            <span className="text-red-400">•</span>
                            <span>{trait}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#101e13] border border-emerald-900/60">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wide">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>After: Neat & Kept State</span>
                    </div>
                    <p className="text-xs text-stone-200 mt-1 leading-relaxed font-medium">
                      {currentItem.afterDescription}
                    </p>
                    {currentItem.afterTraits && (
                      <ul className="mt-2 space-y-1 text-[11px] text-emerald-200/90">
                        {currentItem.afterTraits.map((trait, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-1.5">
                            <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{trait}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Key Neatness Factors */}
                <div>
                  <h4 className="text-[11px] uppercase font-extrabold tracking-wider text-stone-400 mb-1.5">
                    Neatness Guarantee Factors:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {currentItem.neatnessKeyFactors.map((factor, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-stone-300">
                        <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  id={`book-this-transformation-${activeIdx}`}
                  onClick={() => onBookService(currentItem.service)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-700 hover:from-emerald-600 hover:to-green-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/50 cursor-pointer active:scale-95 rasta-btn-glow"
                >
                  <Scissors className="w-3.5 h-3.5 text-amber-300" />
                  <span>Book This Service ({currentItem.service})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VIDEO ACTION VAULT */}
        {activeTab === 'videos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Featured Video Player Area */}
              <div className="lg:col-span-8">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-[#26372a] flex items-center justify-center group">
                  {/* Background Video Poster / Frame */}
                  <img
                    src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1200&q=80"
                    alt="Master P Crochet Video Thumbnail"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  {/* Play Button Overlay */}
                  <button
                    id="play-featured-video-btn"
                    onClick={() => setIsPlayingDemo(!isPlayingDemo)}
                    className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-stone-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 hover:scale-110 active:scale-95 transition-all cursor-pointer group"
                    aria-label="Play video demonstration"
                  >
                    {isPlayingDemo ? (
                      <RotateCcw className="w-8 h-8 text-stone-950 animate-spin" />
                    ) : (
                      <Play className="w-8 h-8 text-stone-950 fill-stone-950 ml-1" />
                    )}
                  </button>

                  {/* Video Meta Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between">
                    <div>
                      <span className="px-2.5 py-1 rounded-md bg-emerald-950/90 text-emerald-300 text-[10px] font-extrabold uppercase border border-emerald-700 tracking-wider">
                        Master P Live Session
                      </span>
                      <h4 className="text-base sm:text-lg font-extrabold text-white mt-1 font-syne">
                        {FEATURED_VIDEOS.find(v => v.id === activeVideoId)?.title || FEATURED_VIDEOS[0].title}
                      </h4>
                      <p className="text-xs text-stone-300 max-w-lg hidden sm:block mt-0.5">
                        {FEATURED_VIDEOS.find(v => v.id === activeVideoId)?.description}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-amber-400 bg-black/70 px-2 py-1 rounded border border-stone-800">
                      {FEATURED_VIDEOS.find(v => v.id === activeVideoId)?.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Video Playlist Sidebar */}
              <div className="lg:col-span-4 space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
                  Featured Live Action Recordings:
                </h4>
                {FEATURED_VIDEOS.map((vid) => (
                  <div
                    key={vid.id}
                    id={`video-item-${vid.id}`}
                    onClick={() => setActiveVideoId(vid.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      activeVideoId === vid.id
                        ? 'bg-[#152419] border-emerald-500/60 shadow-md'
                        : 'bg-[#0f1711] border-[#1d2d20] hover:bg-[#131d15]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1f3324] text-emerald-300">
                            {vid.badge}
                          </span>
                          <span className="text-[10px] text-stone-400">{vid.tag}</span>
                        </div>
                        <h5 className="text-xs font-bold text-white mt-1">
                          {vid.title}
                        </h5>
                        <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">
                          {vid.description}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400 shrink-0">
                        {vid.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Media Preview Modal */}
        {selectedMediaModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-3xl w-full bg-[#0d1610] border border-emerald-500/40 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-[#213526] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                    {selectedMediaModal.category}
                  </span>
                  <span className="text-stone-600">•</span>
                  <h3 className="text-sm font-extrabold text-white truncate max-w-sm">
                    {selectedMediaModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedMediaModal(null)}
                  className="px-2.5 py-1 rounded-lg bg-[#17261a] hover:bg-[#203624] text-stone-300 hover:text-white text-xs font-bold cursor-pointer"
                >
                  Close ✕
                </button>
              </div>

              <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
                {selectedMediaModal.type === 'video' ? (
                  <video
                    src={selectedMediaModal.url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={selectedMediaModal.url}
                    alt={selectedMediaModal.title}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className="p-4 bg-[#09100b] flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-stone-300 max-w-md font-light">
                  {selectedMediaModal.description}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenReplaceModal(
                      selectedMediaModal.id,
                      selectedMediaModal.url,
                      selectedMediaModal.url,
                      selectedMediaModal.title,
                      selectedMediaModal.id
                    )}
                    className="px-3.5 py-1.5 rounded-xl bg-[#18291c] hover:bg-[#233d28] text-amber-300 hover:text-amber-200 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                    title="Replace this individual photo with another image"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>Replace Photo</span>
                  </button>

                  <button
                    onClick={() => handleSetBackdrop(selectedMediaModal)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply as Wallpaper</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Photo Replacement Dialog */}
        <ReplacePhotoModal
          isOpen={replaceModalState.isOpen}
          onClose={() => setReplaceModalState(prev => ({ ...prev, isOpen: false }))}
          photoKey={replaceModalState.photoKey}
          currentPhotoUrl={replaceModalState.currentPhotoUrl}
          originalDefaultUrl={replaceModalState.originalDefaultUrl}
          photoTitle={replaceModalState.photoTitle}
          mediaItemId={replaceModalState.mediaItemId}
          onPhotoReplaced={(newUrl) => {
            if (selectedMediaModal && (selectedMediaModal.id === replaceModalState.photoKey || selectedMediaModal.url === replaceModalState.currentPhotoUrl)) {
              setSelectedMediaModal(prev => prev ? { ...prev, url: newUrl } : null);
            }
            setOverrideRefreshTrigger(prev => prev + 1);
          }}
        />

        {/* Back to top navigation */}
        <BackToTopBar currentSectionName="Studio Gallery & Transformations" />
      </div>
    </section>
  );
};
