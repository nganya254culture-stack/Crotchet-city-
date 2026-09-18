import React, { useEffect, useRef } from 'react';
import { reggaeEngine } from '../audio/reggaeEngine';

interface SoundVisualizerProps {
  isPlaying: boolean;
  dubDropActive: boolean;
  currentSectionTitle: string;
}

export const SoundVisualizer: React.FC<SoundVisualizerProps> = ({
  isPlaying,
  dubDropActive,
  currentSectionTitle
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const vuMeterRef = useRef<HTMLDivElement | null>(null);
  const leftSpeakerRef = useRef<HTMLDivElement | null>(null);
  const rightSpeakerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = reggaeEngine.getAnalyser();
    const bufferLength = analyser ? analyser.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Fallback or idle decay
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = Math.max(0, dataArray[i] * 0.9);
        }
      }

      // Calculate low-frequency energy for speaker cone pump
      let bassSum = 0;
      for (let i = 0; i < 8; i++) {
        bassSum += dataArray[i] || 0;
      }
      const bassEnergy = bassSum / (8 * 255); // 0 to 1

      // Calculate overall level for VU meter
      let totalSum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        totalSum += dataArray[i] || 0;
      }
      const overallLevel = totalSum / (dataArray.length * 255);

      // Animate speaker cones
      const scale = 1 + (isPlaying ? bassEnergy * 0.22 : 0);
      if (leftSpeakerRef.current) {
        leftSpeakerRef.current.style.transform = `scale(${scale})`;
      }
      if (rightSpeakerRef.current) {
        rightSpeakerRef.current.style.transform = `scale(${scale})`;
      }

      // Animate VU meter needle
      if (vuMeterRef.current) {
        const angle = -45 + (overallLevel * 90);
        vuMeterRef.current.style.transform = `rotate(${angle}deg)`;
      }

      // Draw frequency spectrum on canvas
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let y = 10; y < height; y += 15) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Draw Rasta colored spectrum bars (Green, Gold, Red)
      const barCount = 32;
      const barWidth = (width / barCount) - 2;
      let x = 1;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * (bufferLength / 2));
        const value = isPlaying ? dataArray[dataIndex] : (Math.sin(Date.now() * 0.002 + i) * 8 + 12);
        const percent = value / 255;
        const barHeight = Math.max(3, percent * (height - 6));

        // Rasta gradient based on bar height
        let barColor = '#15803d'; // Green (Roots)
        if (percent > 0.45 && percent <= 0.75) {
          barColor = '#eab308'; // Gold (Sun/Lion)
        } else if (percent > 0.75) {
          barColor = '#dc2626'; // Red (Blood/Sacrifice)
        }

        ctx.fillStyle = barColor;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        // Peak dot
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x, height - barHeight - 2, barWidth, 1.5);

        x += barWidth + 2;
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <div id="sound-system-visualizer" className="bg-stone-950 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Sound system decorative badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-stone-800/80 pb-3">
        <div className="flex items-center gap-3">
          {/* Pan-African Tri-Color Ribbon */}
          <div className="flex h-5 w-2 rounded-full overflow-hidden flex-col shadow-inner">
            <span className="h-1/3 bg-emerald-500 w-full" />
            <span className="h-1/3 bg-amber-400 w-full" />
            <span className="h-1/3 bg-rose-600 w-full" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              ROOTS SOUND SYSTEM • DUB TAPE 74 BPM
            </span>
            <div className="text-sm font-serif font-semibold text-stone-200">
              {currentSectionTitle}
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2">
          {dubDropActive && (
            <span className="px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider font-bold bg-rose-950 text-rose-300 border border-rose-600 rounded animate-pulse">
              DUB DROP ACTIVE
            </span>
          )}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono ${
            isPlaying ? 'bg-emerald-950 text-emerald-400 border border-emerald-600' : 'bg-stone-800 text-stone-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-stone-500'}`} />
            {isPlaying ? 'SOUND TRANSMITTING' : 'STANDBY'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Vintage Vinyl Turntable Animation */}
        <div className="md:col-span-4 flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 sm:w-44 sm:h-44 bg-stone-900 rounded-full border-4 border-stone-800 p-2 shadow-inner flex items-center justify-center">
            {/* Vinyl record disc */}
            <div 
              className={`w-full h-full rounded-full bg-stone-950 border-8 border-stone-900 shadow-2xl flex items-center justify-center relative overflow-hidden ${
                isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
              }`}
              style={{
                backgroundImage: 'radial-gradient(circle, #1c1917 2px, transparent 2px), repeating-radial-gradient(circle, #0c0a09 0, #0c0a09 4px, #1c1917 5px, #1c1917 6px)'
              }}
            >
              {/* Record grooves sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-full" />
              
              {/* Center Label (Rasta InI currency medallion) */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-amber-500 border-2 border-stone-900 flex flex-col items-center justify-center text-center p-1 shadow-md z-10">
                <span className="text-[7px] font-black tracking-tighter uppercase text-stone-950 leading-tight">
                  NEVER LOSE
                </span>
                <span className="text-[9px] font-black uppercase text-rose-900 tracking-wider">
                  IDENTITY
                </span>
                <span className="text-[6px] font-mono text-emerald-950 font-bold">
                  45 RPM • DUB
                </span>
                {/* Center hole */}
                <div className="w-2.5 h-2.5 rounded-full bg-stone-950 border border-amber-300 mt-0.5" />
              </div>
            </div>

            {/* Tonearm graphic */}
            <div 
              className={`absolute -top-1 -right-1 w-16 h-20 pointer-events-none transition-transform duration-700 origin-top-right ${
                isPlaying ? 'rotate-12' : '-rotate-12'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-amber-500 shadow ml-auto" />
              <div className="w-1.5 h-16 bg-gradient-to-b from-stone-400 to-stone-600 ml-auto mr-0.5 shadow-md transform rotate-12" />
              <div className="w-3 h-4 bg-amber-600 rounded-sm ml-auto mr-2" />
            </div>
          </div>
          <span className="text-[11px] font-mono text-stone-400 mt-2">
            One-Drop Heavy Vinyl • 74 BPM
          </span>
        </div>

        {/* Center: Real-time Audio Spectrum & Frequency Visualizer */}
        <div className="md:col-span-5 flex flex-col items-center w-full">
          <div className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 shadow-inner">
            <div className="flex justify-between items-center text-[10px] font-mono text-stone-400 mb-1.5">
              <span>SUB BASS (35Hz)</span>
              <span>MID SKANK (1.2kHz)</span>
              <span>MELODICA (4.5kHz)</span>
            </div>
            <canvas 
              ref={canvasRef} 
              width={340} 
              height={90} 
              className="w-full h-24 rounded bg-stone-950/90 block"
            />
            <div className="flex justify-between items-center text-[9px] font-mono text-stone-500 mt-1.5">
              <span className="text-emerald-500">ROOTS & HERB</span>
              <span className="text-amber-500">SPIRITUAL GOLD</span>
              <span className="text-rose-500">BLOOD SACRIFICE</span>
            </div>
          </div>
        </div>

        {/* Right: Sound System Cabinet & Analog VU Meter */}
        <div className="md:col-span-3 flex flex-col items-center gap-3 w-full">
          {/* Retro Analog VU Meter */}
          <div className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 flex flex-col items-center">
            <div className="w-full h-14 bg-amber-100/90 rounded-md border border-stone-700 relative overflow-hidden shadow-inner flex flex-col justify-end p-1">
              {/* VU Arc markings */}
              <div className="absolute top-1 inset-x-2 flex justify-between text-[8px] font-mono text-stone-700 font-bold">
                <span>-20</span>
                <span>-7</span>
                <span>-3</span>
                <span>0</span>
                <span className="text-rose-600">+3 dB</span>
              </div>
              <div className="absolute top-4 inset-x-3 h-0.5 bg-gradient-to-r from-stone-600 via-stone-800 to-rose-600" />
              {/* Needle pivot and arm */}
              <div className="relative w-full h-8 flex justify-center items-end">
                <div 
                  ref={vuMeterRef} 
                  className="w-0.5 h-10 bg-stone-900 origin-bottom transition-transform duration-75 shadow-sm"
                  style={{ transform: 'rotate(-45deg)' }}
                />
                <div className="absolute -bottom-1 w-4 h-4 rounded-full bg-stone-900 border border-amber-300" />
              </div>
            </div>
            <span className="text-[10px] font-mono text-amber-400 mt-1 uppercase tracking-widest font-semibold">
              OUTPUT VU LEVEL
            </span>
          </div>

          {/* Subwoofer Bass Cones */}
          <div className="w-full bg-stone-900/90 border border-stone-800 rounded-xl p-2.5 flex items-center justify-around">
            <div className="text-center">
              <div 
                ref={leftSpeakerRef} 
                className="w-12 h-12 rounded-full bg-stone-950 border-4 border-stone-700 flex items-center justify-center transition-transform duration-75 shadow-lg mx-auto"
              >
                <div className="w-4 h-4 rounded-full bg-stone-800 border border-stone-600" />
              </div>
              <span className="text-[9px] font-mono text-stone-400 block mt-1">18" SUB L</span>
            </div>

            <div className="text-center">
              <div 
                ref={rightSpeakerRef} 
                className="w-12 h-12 rounded-full bg-stone-950 border-4 border-stone-700 flex items-center justify-center transition-transform duration-75 shadow-lg mx-auto"
              >
                <div className="w-4 h-4 rounded-full bg-stone-800 border border-stone-600" />
              </div>
              <span className="text-[9px] font-mono text-stone-400 block mt-1">18" SUB R</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
