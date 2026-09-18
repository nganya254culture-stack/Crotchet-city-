import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Square, Download, Sparkles, Send, Trash2, CheckCircle2 } from 'lucide-react';
import { reggaeEngine } from '../audio/reggaeEngine';

interface ChantStudioProps {
  isPlaying: boolean;
  onPlayRiddim: () => void;
}

export const ChantStudio: React.FC<ChantStudioProps> = ({
  isPlaying,
  onPlayRiddim,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [customVerse, setCustomVerse] = useState<string>(
    "Dem close the gate, dem shake dem head,\nDem tell me change the words I said.\nBut InI crown is planted deep,\nA promise that I have to keep.\nRasta is the only currency I hold!"
  );
  const [verseSpoken, setVerseSpoken] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioPlaybackRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Ensure audio context and riddim are rolling
      if (!isPlaying) {
        onPlayRiddim();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn("Microphone access denied or unavailable", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(t => t.stop());
      }
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleSpeakCustomVerse = () => {
    if (!customVerse.trim()) return;
    setVerseSpoken(true);
    // Start audio if paused
    if (!isPlaying) {
      onPlayRiddim();
    }
    reggaeEngine.speakLyric(customVerse);
    setTimeout(() => setVerseSpoken(false), 8000);
  };

  return (
    <div id="chant-studio-panel" className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4 mb-5">
        <div>
          <h3 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2">
            <span>Roots Chant Studio</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-normal">
              Voice Your Testimony
            </span>
          </h3>
          <p className="text-xs text-stone-400">
            Sing or chant your own words of steadfast faith directly over the one-drop dub riddim.
          </p>
        </div>

        {/* Recording status badge */}
        {isRecording && (
          <div className="flex items-center gap-2 px-3 py-1 bg-rose-950/80 border border-rose-600 rounded-lg text-rose-300 text-xs font-mono animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>RECORDING: {recordingDuration}s</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Custom Lyric & Verse Writer */}
        <div className="md:col-span-7 bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                WRITE YOUR CHANT / VERSE
              </span>
              <span className="text-[10px] font-mono text-stone-400">Am Reggae Rhythm</span>
            </div>

            <textarea
              id="custom-verse-textarea"
              value={customVerse}
              onChange={(e) => setCustomVerse(e.target.value)}
              rows={5}
              className="w-full bg-stone-900 border border-stone-700/80 rounded-lg p-3 text-sm text-stone-200 font-serif leading-relaxed focus:outline-none focus:border-amber-400 resize-none"
              placeholder="Write your story of staying steadfast when the system refuses you..."
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-stone-800">
            <button
              id="btn-speak-verse"
              onClick={handleSpeakCustomVerse}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{verseSpoken ? 'CHANTING OVER RIDDIM...' : 'HEAR CHANT OVER RIDDIM'}</span>
            </button>

            <button
              id="btn-clear-verse"
              onClick={() => setCustomVerse('')}
              className="px-2.5 py-1.5 rounded-lg text-stone-500 hover:text-stone-300 text-xs font-mono flex items-center gap-1 transition-all"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Right: Mic Recording & Audio Playback */}
        <div className="md:col-span-5 bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold block mb-2">
              LIVE MIC INPUT OVER RIDDIM
            </span>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Turn on the microphone while the riddim plays. Sing your chorus or chant your reasoning.
            </p>

            <div className="flex items-center justify-center my-2">
              <button
                id="btn-toggle-mic-record"
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 rounded-full flex flex-col items-center justify-center gap-1 transition-all shadow-xl ${
                  isRecording
                    ? 'bg-rose-600 hover:bg-rose-500 text-white ring-4 ring-rose-400/50 animate-pulse'
                    : 'bg-stone-800 hover:bg-stone-700 text-emerald-400 border border-stone-700'
                }`}
              >
                {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                <span className="text-[10px] font-mono font-bold tracking-wider">
                  {isRecording ? 'STOP' : 'RECORD'}
                </span>
              </button>
            </div>
          </div>

          {/* Recorded Take Playback */}
          {audioUrl && (
            <div className="mt-4 pt-3 border-t border-stone-800/80">
              <span className="text-[10px] font-mono text-emerald-400 block mb-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                TAKE RECORDED SUCCESSFULLY
              </span>
              <audio
                ref={audioPlaybackRef}
                src={audioUrl}
                controls
                className="w-full h-8 mt-1 block"
              />
              <a
                href={audioUrl}
                download="rasta_identity_chant.webm"
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Audio Recording</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
