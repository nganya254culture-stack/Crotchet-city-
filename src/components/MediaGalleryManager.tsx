import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Sparkles, 
  Check, 
  Copy, 
  Trash2, 
  RotateCcw, 
  Eye, 
  Sliders, 
  X, 
  Plus, 
  FileText, 
  ExternalLink,
  AlertTriangle,
  HardDrive,
  Cloud,
  CheckCircle2
} from 'lucide-react';
import { 
  MediaItem, 
  getActiveBackground, 
  setActiveBackground, 
  resetActiveBackground, 
  getCustomMediaList, 
  loadAllMediaAsync,
  addCustomMediaItemAsync,
  deleteMediaItemAsync,
  clearAllMedia,
  DEFAULT_BACKGROUND_PHOTO 
} from '../data/mediaGallery';

interface MediaGalleryManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MediaGalleryManager: React.FC<MediaGalleryManagerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'background' | 'gallery' | 'storageExplainer'>('gallery');
  const [currentBg, setCurrentBg] = useState<{ url: string; type: 'image' | 'video' }>(() => getActiveBackground());
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);

  // Upload Form State
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video'>('image');
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCategory, setMediaCategory] = useState<'background' | 'transformation' | 'showcase' | 'team' | 'video'>('showcase');
  const [externalUrl, setExternalUrl] = useState('');
  const [fileSizeFormatted, setFileSizeFormatted] = useState<string | undefined>(undefined);
  const [isSettingBgImmediately, setIsSettingBgImmediately] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load media list on open and listen for updates
  useEffect(() => {
    if (isOpen) {
      setCurrentBg(getActiveBackground());
      loadAllMediaAsync().then(items => setMediaList(items));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleMediaUpdated = () => {
      loadAllMediaAsync().then(items => setMediaList(items));
    };
    const handleBgChange = (e: Event) => {
      try {
        const customEv = e as CustomEvent<{ url: string; type: 'image' | 'video' }>;
        if (customEv && customEv.detail && typeof customEv.detail.url === 'string') {
          setCurrentBg({
            url: customEv.detail.url,
            type: customEv.detail.type === 'video' ? 'video' : 'image',
          });
        } else {
          setCurrentBg(getActiveBackground());
        }
      } catch {
        setCurrentBg(getActiveBackground());
      }
    };

    window.addEventListener('crochet-media-updated', handleMediaUpdated);
    window.addEventListener('crochet-bg-changed', handleBgChange as EventListener);
    return () => {
      window.removeEventListener('crochet-media-updated', handleMediaUpdated);
      window.removeEventListener('crochet-bg-changed', handleBgChange as EventListener);
    };
  }, []);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadError(null);
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      const isVideo = file.type.startsWith('video/');
      setFileType(isVideo ? 'video' : 'image');

      // Format file size
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setFileSizeFormatted(`${sizeMb} MB`);

      if (!mediaTitle) {
        setMediaTitle(file.name.replace(/\.[^/.]+$/, ''));
      }

      // If it's a huge video (> 100MB), give helpful advice
      if (file.size > 100 * 1024 * 1024) {
        setUploadError('File is larger than 100MB. Consider uploading to Cloudinary, YouTube, or Google Drive for faster streaming.');
      }

      // Read file into URL object or base64
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const result = loadEvent.target?.result as string;
        if (result) {
          setFilePreview(result);
        }
      };
      reader.onerror = (err) => {
        console.warn('File reading error:', err);
        setUploadError('Could not read the selected file. Try a different format.');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.warn('File selection handler caught error:', err);
      setUploadError('Error processing file.');
    }
  };

  const handleSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingUpload(true);
    setUploadError(null);

    try {
      const finalUrl = filePreview || externalUrl.trim();
      if (!finalUrl) {
        setUploadError('Please select a file or enter a valid media URL.');
        setIsProcessingUpload(false);
        return;
      }

      await addCustomMediaItemAsync({
        title: mediaTitle.trim() || 'Crochet City Media',
        category: mediaCategory,
        url: finalUrl,
        type: fileType,
        description: `Crochet City studio ${fileType} uploaded on ${new Date().toLocaleDateString()}.`,
        fileSizeFormatted: fileSizeFormatted,
      });

      if (isSettingBgImmediately || mediaCategory === 'background') {
        setActiveBackground(finalUrl, fileType);
        setCurrentBg({ url: finalUrl, type: fileType });
      }

      const updated = await loadAllMediaAsync();
      setMediaList(updated);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);

      // Reset form
      setFilePreview(null);
      setExternalUrl('');
      setMediaTitle('');
      setFileSizeFormatted(undefined);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setActiveTab('gallery');
    } catch (err) {
      console.warn('Error saving media:', err);
      setUploadError('Failed to save media. Check file size.');
    } finally {
      setIsProcessingUpload(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    await deleteMediaItemAsync(id);
    const updated = await loadAllMediaAsync();
    setMediaList(updated);
  };

  const handleClearAllPrevious = async () => {
    if (!window.confirm('Are you sure you want to delete ALL previous media and reset the gallery? This cannot be undone.')) {
      return;
    }
    setIsDeletingAll(true);
    try {
      await clearAllMedia();
      setMediaList([]);
      setCurrentBg({ url: DEFAULT_BACKGROUND_PHOTO, type: 'image' });
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleSetAsBackground = (url: string, type: 'image' | 'video') => {
    setActiveBackground(url, type);
    setCurrentBg({ url, type });
  };

  const handleResetBackground = () => {
    resetActiveBackground();
    setCurrentBg({ url: DEFAULT_BACKGROUND_PHOTO, type: 'image' });
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.warn('Clipboard write prevented:', err);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0b130e] border border-emerald-500/30 shadow-2xl shadow-black overflow-hidden">
        
        {/* Luxury Rasta Ambient Header Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 bg-[#0e1912] border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border border-emerald-500/40 flex items-center justify-center text-amber-400 shadow-sm">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-100 font-cinzel">
                  Studio Media Vault
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {mediaList.length} Active Items
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Manage dreadlocks photos, shake-test videos, background art, or purge previous media.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Purge All Media Button */}
            <button
              id="purge-all-media-btn"
              onClick={handleClearAllPrevious}
              disabled={isDeletingAll}
              className="px-2.5 py-1.5 rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-700/50 text-red-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Delete all previous media and clear browser cache"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Delete All Media</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#142319] hover:bg-[#1a3224] text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="Close Media Manager"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 sm:px-7 py-2.5 bg-[#090f0b] border-b border-[#182a1d] overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#121f16]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Current Media ({mediaList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#121f16]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Photo/Video</span>
          </button>

          <button
            onClick={() => setActiveTab('background')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'background'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#121f16]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Backdrop Setting</span>
          </button>

          <button
            onClick={() => setActiveTab('storageExplainer')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'storageExplainer'
                ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white shadow-md'
                : 'text-amber-400 hover:text-amber-300 hover:bg-[#121f16]'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            <span>Why Storage Limits Happen</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">

          {/* TAB 1: MEDIA GALLERY (SHOWS ONLY CURRENT VALID MEDIA) */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#1a2f20]">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Studio Photo & Video Collection
                  </h3>
                  <p className="text-xs text-stone-400">
                    All previous mock stock photos have been deleted. Only real media added by you is shown here.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Media</span>
                </button>
              </div>

              {mediaList.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-2xl bg-[#09120c] border border-dashed border-[#1f3825] space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-amber-400">
                    <ImageIcon className="w-7 h-7" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="text-base font-bold text-white">Previous Media Has Been Cleaned Out</h4>
                    <p className="text-xs text-stone-400">
                      The media gallery is now completely clean of old stock items. You can upload your own photos and videos directly below or add hosted URLs.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload First Photo or Video</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mediaList.map((item) => (
                    <div 
                      key={item.id}
                      className="group relative rounded-2xl bg-[#0e1711] border border-[#1f3524] overflow-hidden flex flex-col hover:border-amber-400/50 transition-all shadow-lg"
                    >
                      {/* Media Preview Box */}
                      <div className="relative aspect-[16/10] bg-black overflow-hidden flex items-center justify-center">
                        {item.type === 'video' ? (
                          <video 
                            src={item.url} 
                            controls={false}
                            muted 
                            playsInline 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <img 
                            src={item.url} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        
                        {/* Type Badge */}
                        <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[10px] font-mono font-bold text-stone-200 border border-stone-700 flex items-center gap-1">
                          {item.type === 'video' ? <Video className="w-3 h-3 text-red-400" /> : <ImageIcon className="w-3 h-3 text-emerald-400" />}
                          <span className="uppercase">{item.type}</span>
                        </div>

                        {/* Size Badge */}
                        {item.fileSizeFormatted && (
                          <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[10px] font-mono font-bold text-amber-300 border border-amber-400/30">
                            {item.fileSizeFormatted}
                          </div>
                        )}

                        {/* Active background indicator */}
                        {currentBg.url === item.url && (
                          <div className="absolute bottom-2.5 left-2.5 z-10 px-2.5 py-1 rounded-lg bg-emerald-950/95 border border-emerald-500/80 text-emerald-300 text-[10px] font-bold flex items-center gap-1 shadow-md">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Active Background</span>
                          </div>
                        )}
                      </div>

                      {/* Info & Actions */}
                      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-mono font-bold text-amber-400/90 tracking-wider">
                              {item.category}
                            </span>
                            <span className="text-[10px] text-stone-500">{item.addedAt || 'Added'}</span>
                          </div>
                          <h4 className="text-xs font-bold text-stone-100 mt-0.5 truncate" title={item.title}>
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Control Buttons */}
                        <div className="pt-2 border-t border-[#182a1d] flex items-center justify-between gap-1.5">
                          <button
                            onClick={() => handleSetAsBackground(item.url, item.type)}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-[#142318] hover:bg-[#1b3122] text-amber-300 hover:text-white border border-amber-500/30 text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Set as Backdrop</span>
                          </button>

                          <button
                            onClick={() => copyToClipboard(item.url, item.id)}
                            className="p-1.5 rounded-lg bg-[#142318] hover:bg-[#1b3122] text-stone-400 hover:text-white border border-stone-700 text-xs transition-colors cursor-pointer"
                            title="Copy URL"
                          >
                            {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-900/40 text-xs transition-colors cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UPLOAD NEW PHOTO OR VIDEO */}
          {activeTab === 'upload' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white font-cinzel">
                  Upload Studio Photo or Video
                </h3>
                <p className="text-xs text-stone-400">
                  Select a photo or video from your device, or paste a link from Cloudinary, Imgur, Supabase, or YouTube.
                </p>
              </div>

              {uploadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Media added to gallery successfully!</span>
                </div>
              )}

              {uploadError && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <form onSubmit={handleSaveMedia} className="space-y-4">
                {/* File picker drop area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#1f3825] hover:border-amber-400/60 rounded-2xl p-6 text-center cursor-pointer bg-[#09120c] hover:bg-[#0c1810] transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-stone-200">
                    Click to browse or drop phone photo / video here
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Supports JPG, PNG, WEBP, MP4, MOV. Powered by high-capacity IndexedDB.
                  </p>
                  {fileSizeFormatted && (
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold">
                      Selected size: {fileSizeFormatted}
                    </span>
                  )}
                </div>

                {/* Preview if file selected */}
                {filePreview && (
                  <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-black max-h-56 mx-auto border border-[#1f3825]">
                    {fileType === 'video' ? (
                      <video src={filePreview} controls className="w-full h-full object-contain" />
                    ) : (
                      <img src={filePreview} alt="Preview" className="w-full h-full object-contain" />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setFilePreview(null);
                        setFileSizeFormatted(undefined);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 text-stone-300 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* OR External URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300">
                    Or Paste Direct Web URL (Cloudinary, Imgur, Supabase, etc.)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.yourcdn.com/my-dreadlocks.jpg"
                    value={externalUrl}
                    onChange={(e) => {
                      setExternalUrl(e.target.value);
                      if (e.target.value.includes('.mp4') || e.target.value.includes('.mov')) {
                        setFileType('video');
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#09120c] border border-[#1f3825] text-white text-xs placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-300">Title / Caption</label>
                    <input
                      type="text"
                      placeholder="e.g. Master P Shake Test or Root Retwist"
                      value={mediaTitle}
                      onChange={(e) => setMediaTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#09120c] border border-[#1f3825] text-white text-xs placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-300">Display Category</label>
                    <select
                      value={mediaCategory}
                      onChange={(e) => setMediaCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#09120c] border border-[#1f3825] text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="transformation">Before & After Transformation</option>
                      <option value="video">Shake Test / Live Video</option>
                      <option value="showcase">Master Needle Showcase</option>
                      <option value="background">Background Backdrop</option>
                      <option value="team">Team & Studio</option>
                    </select>
                  </div>
                </div>

                {/* Instant Background Checkbox */}
                <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isSettingBgImmediately}
                    onChange={(e) => setIsSettingBgImmediately(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-[#09120c] border-stone-700"
                  />
                  <span>Set as active background image/video immediately upon saving</span>
                </label>

                {/* Save CTA */}
                <button
                  type="submit"
                  disabled={isProcessingUpload}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-amber-500 to-green-600 hover:from-emerald-500 hover:to-green-500 text-stone-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isProcessingUpload ? 'Saving to High-Capacity Storage...' : 'Save Media to Crochet City'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: BACKDROP SETTINGS */}
          {activeTab === 'background' && (
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white font-cinzel">
                  Active App Background
                </h3>
                <p className="text-xs text-stone-400">
                  The background shows behind all semi-transparent sections and page cards.
                </p>
              </div>

              <div className="rounded-2xl bg-[#09120c] border border-[#1f3825] overflow-hidden">
                <div className="relative aspect-video bg-black flex items-center justify-center">
                  {currentBg.type === 'video' ? (
                    <video src={currentBg.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  ) : (
                    <img src={currentBg.url} alt="Current background" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-sm text-xs font-bold text-emerald-300 border border-emerald-500/40">
                    Live Background ({currentBg.type})
                  </div>
                </div>

                <div className="p-4 flex flex-wrap items-center justify-between gap-3 bg-[#0d1711]">
                  <div className="text-xs text-stone-300 truncate max-w-sm">
                    <span className="text-stone-500">Source: </span>
                    <span className="font-mono text-[11px] text-amber-300">{currentBg.url.slice(0, 45)}...</span>
                  </div>
                  <button
                    onClick={handleResetBackground}
                    className="px-3.5 py-1.5 rounded-xl bg-[#142318] hover:bg-[#1b3122] text-stone-300 hover:text-white border border-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reset to Studio Default</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXPLAINER ON WHY STORAGE LIMITS HAPPEN */}
          {activeTab === 'storageExplainer' && (
            <div className="max-w-2xl mx-auto space-y-4 text-xs text-stone-300">
              <div className="p-4 rounded-2xl bg-[#0f1b13] border border-emerald-500/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <HardDrive className="w-5 h-5" />
                  <h4>Why Was It Not Possible to Add More Media Before?</h4>
                </div>
                <p className="leading-relaxed">
                  Web browsers enforce a strict security limit of <strong className="text-white">~5 MB total</strong> on basic <code className="text-amber-300 bg-black/50 px-1 py-0.5 rounded">localStorage</code>.
                </p>
                <p className="leading-relaxed">
                  A modern smartphone photo is typically 3 MB to 8 MB, and a 10-second video is 20 MB to 60 MB. When converted into raw text (Base64), the size increases by 33%. Storing just one or two full-resolution photos in <code className="text-amber-300 bg-black/50 px-1 py-0.5 rounded">localStorage</code> immediately exceeds the browser quota, causing the browser to throw a silent <strong className="text-red-400">QuotaExceededError</strong> and reject any new media!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#0a120c] border border-[#1f3825] space-y-1.5">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Solution 1: IndexedDB (Now Active)
                  </span>
                  <p className="text-stone-400 text-[11px] leading-relaxed">
                    We upgraded Crochet City to store files in <strong>IndexedDB</strong>, which allows <span className="text-white">gigabytes</span> of media without crashing your browser.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0a120c] border border-[#1f3825] space-y-1.5">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Cloud className="w-4 h-4" />
                    Solution 2: Cloud Hosted URLs
                  </span>
                  <p className="text-stone-400 text-[11px] leading-relaxed">
                    For videos and permanent multi-device access, hosting files on free CDNs like <strong>Cloudinary, Imgur, Supabase, or YouTube</strong> uses 0 bytes of local browser space and loads instantly on every client device.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-7 py-3 bg-[#0a100c] border-t border-[#182a1d] flex items-center justify-between text-xs text-stone-400">
          <span>Crochet City Studio Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
