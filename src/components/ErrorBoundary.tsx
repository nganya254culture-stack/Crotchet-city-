import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Crochet City Application Error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      this.setState({ hasError: false, error: null });
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070b08] text-[#f4f2eb] flex items-center justify-center p-6 select-none">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#0e1610] border border-amber-500/30 shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black font-cinzel text-white">
                Crown Harmony Restored
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                An unexpected interface anomaly was caught. Your styling and settings remain safe.
              </p>
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600 text-stone-950 font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Crochet City Studio</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
