import React from 'react';
import { MonitorUp } from 'lucide-react';

interface VideoGridProps {
  userVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteStreams: { id: string; stream: MediaStream }[];
  isScreenSharing: boolean;
  isVideoOff: boolean;
}

export default function VideoGrid({ userVideoRef, remoteStreams, isScreenSharing, isVideoOff }: VideoGridProps) {
  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6 justify-center items-center">
      {/* Local User */}
      <div className={`relative w-full max-w-4xl aspect-video bg-slate-900 rounded-[2rem] overflow-hidden border transition-all ${isScreenSharing ? 'border-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.3)]' : 'border-white/10 shadow-2xl'}`}>
        <video 
          ref={userVideoRef} 
          autoPlay 
          muted 
          playsInline
          className={`w-full h-full object-cover ${isVideoOff && !isScreenSharing ? 'hidden' : ''}`} 
          style={{ transform: isScreenSharing ? 'none' : 'scaleX(-1)' }}
        />
        {isVideoOff && !isScreenSharing && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-4xl text-white font-bold shadow-lg">
              Y
            </div>
          </div>
        )}
        <div className="absolute bottom-6 left-6 bg-slate-950/60 backdrop-blur-xl px-4 py-2 rounded-xl text-white text-sm font-medium border border-white/10 flex items-center gap-2 shadow-lg">
          {isScreenSharing && <MonitorUp className="w-4 h-4 text-blue-400" />}
          {isScreenSharing ? 'You (Presenting)' : 'You'}
        </div>
      </div>

      {/* Remote Users */}
      {remoteStreams.length > 0 && (
        <div className="flex flex-col gap-4 w-full md:w-80">
          {remoteStreams.map((remote, idx) => (
            <div key={remote.id} className="relative w-full aspect-video bg-slate-900 rounded-[1.5rem] overflow-hidden border border-white/10 shadow-xl">
              <video 
                autoPlay 
                playsInline
                ref={(vid) => { if (vid) vid.srcObject = remote.stream }}
                className="w-full h-full object-cover" 
              />
              <div className="absolute bottom-4 left-4 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-medium border border-white/10">
                Participant {idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
