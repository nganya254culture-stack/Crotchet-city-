import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Check, 
  RotateCcw, 
  X, 
  Sparkles, 
  AlertCircle,
  Camera,
  Layers
} from 'lucide-react';
import { 
  savePhotoOverrideAsync, 
  removePhotoOverrideAsync, 
  hasPhotoOverride, 
  getPhotoOverride,
  updateMediaItemAsync 
} from '../data/mediaGallery';
import { compressImageFile } from '../utils/imageCompressor';

interface ReplacePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoKey: string; // Unique ID or original URL
  currentPhotoUrl: string;
  originalDefaultUrl?: string;
  photoTitle?: string;
  mediaItemId?: string; // If this belongs to a MediaItem in the gallery
  onPhotoReplaced?: (newUrl: string) => void;
}

export const ReplacePhotoModal: React.FC<ReplacePhotoModalProps> = ({
  isOpen,
  onClose,
  photoKey,
  currentPhotoUrl,
  originalDefaultUrl,
  photoTitle = 'Studio Photo',
  mediaItemId,
  onPhotoReplaced,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCustomized = hasPhotoOverride(photoKey) || (mediaItemId && hasPhotoOverride(mediaItemId));

  // Reset states on open
  useEffect(() => {
    if (isOpen) {
      setNewPhotoPreview(null);
      setInputUrl('');
      setSaveSuccess(false);
      setErrorMessage(null);
    }
  }, [isOpen, photoKey]);

  if (!isOpen) return null;

  // Handle local file selection with compression
  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Compress to optimal web dimensions so it renders instantly and saves reliably
      const compressedDataUrl = await compressImageFile(file, 1600, 1600, 0.86);
      setNewPhotoPreview(compressedDataUrl);
    } catch (err: any) {
      console.error('Photo compression error:', err);
      setErrorMessage('Failed to read or optimize image. Please try another file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputUrl.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:')) {
      setErrorMessage('Please enter a valid image URL (e.g. https://...)');
      return;
    }
    setNewPhotoPreview(trimmed);
    setErrorMessage(null);
  };

  // Save changes persistently
  const handleSave = async () => {
    const finalUrl = newPhotoPreview;
    if (!finalUrl) {
      setErrorMessage('Please choose or enter a new photo first.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Save to global photo overrides
      await savePhotoOverrideAsync(photoKey, finalUrl, photoTitle);

      // 2. Also register by original URL so any other instances update too
      if (originalDefaultUrl && originalDefaultUrl !== photoKey) {
        await savePhotoOverrideAsync(originalDefaultUrl, finalUrl, photoTitle);
      }

      // 3. If tied to a MediaItem, update in gallery
      if (mediaItemId) {
        await updateMediaItemAsync(mediaItemId, { 
          url: finalUrl,
          thumbnail: finalUrl 
        });
      }

      setSaveSuccess(true);
      if (onPhotoReplaced) {
        onPhotoReplaced(finalUrl);
      }

      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Failed to save photo:', err);
      setErrorMessage('Could not save photo override. Please retry.');
      setIsProcessing(false);
    }
  };

  // Revert back to original photo
  const handleRevert = async () => {
    if (!window.confirm('Revert this photo back to the original studio image?')) return;

    setIsProcessing(true);
    try {
      await removePhotoOverrideAsync(photoKey);
      if (originalDefaultUrl) {
        await removePhotoOverrideAsync(originalDefaultUrl);
      }
      if (mediaItemId) {
        await removePhotoOverrideAsync(mediaItemId);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error('Error reverting photo:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative max-w-xl w-full bg-[#0d1610] border border-emerald-500/50 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#1f3323] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white font-syne">
                  Replace Studio Photo
                </h3>
                {isCustomized && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Customized
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 truncate max-w-[280px] sm:max-w-md">
                {photoTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#142217] hover:bg-[#1d3522] text-stone-400 hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Side-by-side Visual Comparison Previews */}
          <div className="grid grid-cols-2 gap-3">
            {/* Current Photo */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-400">
                <span>Current Photo</span>
                {isCustomized && (
                  <span className="text-amber-400 text-[10px]">• Replaced</span>
                )}
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black border border-stone-800 shadow-inner">
                <img
                  src={currentPhotoUrl}
                  alt="Current preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* New Replacement Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
                <span>New Replacement</span>
                {newPhotoPreview && (
                  <span className="text-emerald-400 text-[10px] font-bold">Ready</span>
                )}
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black border-2 border-dashed border-emerald-500/50 flex items-center justify-center shadow-inner">
                {newPhotoPreview ? (
                  <>
                    <img
                      src={newPhotoPreview}
                      alt="New replacement preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 text-[9px] font-extrabold border border-emerald-500">
                      NEW
                    </div>
                  </>
                ) : (
                  <div className="p-3 text-center text-stone-500 space-y-1">
                    <ImageIcon className="w-6 h-6 mx-auto opacity-40 text-emerald-400" />
                    <p className="text-[10px] font-medium leading-tight">
                      Select a photo below to preview replacement
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tab Selector: Upload from Device vs Direct Web URL */}
          <div className="flex p-1 rounded-xl bg-[#09110b] border border-[#1b2b1e]">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload from Device</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Paste Image URL</span>
            </button>
          </div>

          {/* Option A: Upload from Device */}
          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer ${
                isDragging 
                  ? 'border-amber-400 bg-amber-500/10' 
                  : 'border-[#243a29] hover:border-emerald-500/60 bg-[#0e1710]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
                }}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-700/50 flex items-center justify-center mx-auto mb-2 shadow-inner">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-white">
                Tap to choose from Phone Library / Camera
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                Supports JPG, PNG, WEBP • Automatically optimized for high-speed rendering
              </p>
            </div>
          )}

          {/* Option B: Direct Image URL */}
          {activeTab === 'url' && (
            <form onSubmit={handleUrlSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300">
                  Image Link (URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or https://..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#09110b] border border-[#213526] text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#18271c] hover:bg-[#223827] text-amber-300 text-xs font-bold border border-emerald-600/40 cursor-pointer"
                  >
                    Preview
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-stone-500">
                You can paste direct image links from Cloudinary, Imgur, Google Drive, Pinterest, or any web source.
              </p>
            </form>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-700 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold">Photo successfully replaced and saved into your studio database!</span>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#09110b] border-t border-[#1f3323] flex flex-wrap items-center justify-between gap-3">
          {/* Revert Button (only if customized) */}
          <div>
            {isCustomized && (
              <button
                type="button"
                onClick={handleRevert}
                disabled={isProcessing}
                className="px-3 py-2 rounded-xl bg-[#141e17] hover:bg-red-950/80 text-stone-400 hover:text-red-300 border border-stone-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Reset to the original default photo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Revert to Original</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#121c15] hover:bg-[#1a2b1f] text-stone-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!newPhotoPreview || isProcessing}
              className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-lg ${
                newPhotoPreview && !isProcessing
                  ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 text-stone-950 cursor-pointer shadow-emerald-950/60 hover:brightness-110'
                  : 'bg-stone-800 text-stone-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isProcessing ? 'Saving Changes...' : 'Save Replacement'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
