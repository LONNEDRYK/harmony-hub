import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { X, Mic, Image, Type, Paperclip, FlipHorizontal, Settings } from 'lucide-react';
import cameraBg from '@/assets/camera-bg.png';

const Record = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraActivated, setCameraActivated] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (cameraActivated) {
      startCamera();
    }
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [facingMode, cameraActivated]);

  const startCamera = async () => {
    try {
      stream?.getTracks().forEach(track => track.stop());
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: true,
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error('Camera access denied:', err);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      if (!stream) return;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        console.log('Recording saved:', url);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    }
  };

  const flipCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // Activation screen
  if (!cameraActivated) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        {/* Close button */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-safe z-20 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Full screen blurred background */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          <img
            src={cameraBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'blur(20px)', transform: 'scale(1.15)' }}
          />
          
          {/* Rounded card overlay */}
          <div className="absolute inset-4 rounded-3xl overflow-hidden">
            <img
              src={cameraBg}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'blur(18px)', transform: 'scale(1.1)' }}
            />
          </div>

          {/* Text + CTA centered */}
          <div className="relative z-10 text-center px-10">
            <p className="text-black text-xl font-semibold leading-relaxed mb-8">
              Enregistrez-vous entrain de chanter et partager à vos amis pour 5 crédits à gagner
            </p>
            <button
              onClick={() => setCameraActivated(true)}
              className="px-10 py-4 rounded-full bg-white text-black font-bold text-lg shadow-xl"
            >
              Activer la caméra
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Camera Preview - takes most of the screen */}
      <div className="flex-1 relative overflow-hidden rounded-b-3xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Top bar - close button only */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-safe flex items-center justify-start">
          <button
            onClick={() => {
              stream?.getTracks().forEach(track => track.stop());
              navigate(-1);
            }}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Bottom overlay controls inside camera view */}
        <div className="absolute bottom-0 left-0 right-0 pb-6">
          {/* Settings & Flip buttons - left and right of center */}
          <div className="flex items-end justify-center gap-8 mb-4">
            <button className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </button>

            {/* Record button - center */}
            <button onClick={toggleRecording} className="relative">
              <div className={`w-[72px] h-[72px] rounded-full border-[3px] border-white flex items-center justify-center transition-all ${isRecording ? 'scale-105' : ''}`}>
                <div className={`rounded-full transition-all ${isRecording ? 'w-7 h-7 rounded-md bg-red-500' : 'w-[58px] h-[58px] bg-white'}`} />
              </div>
            </button>

            <button
              onClick={flipCamera}
              className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center"
            >
              <FlipHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Tool icons row */}
          <div className="flex items-center justify-center gap-10">
            <button className="flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
              <Image className="w-6 h-6 text-white" />
            </button>
            <button className="flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
              <Mic className="w-6 h-6 text-white" />
            </button>
            <button className="flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
              <Type className="w-6 h-6 text-white" />
            </button>
            <button className="flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
              <Paperclip className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom stories/recent section */}
      <div className="bg-black px-4 py-4 pb-safe">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {[
            { time: '2h', color: 'bg-muted/20', hasImage: true },
            { time: '1h', color: 'bg-primary/30', hasAvatar: true },
            { time: '1m', color: 'bg-primary', hasText: true, text: 'Nouveau morceau disponible !' },
            { time: 'now', color: 'bg-muted/20', hasFile: true, file: 'audio_mix.mp3' },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-[120px] h-[120px] rounded-2xl ${item.color} relative overflow-hidden flex flex-col justify-between p-3`}
            >
              <span className="text-xs font-semibold text-green-400 self-end">{item.time}</span>
              <div className="flex-1 flex items-center justify-center">
                {item.hasAvatar && (
                  <div className="w-12 h-12 rounded-full bg-primary/40 border-2 border-primary/60" />
                )}
                {item.hasText && (
                  <p className="text-xs text-white font-medium leading-tight text-center">{item.text}</p>
                )}
                {item.hasFile && (
                  <div className="text-center">
                    <div className="w-10 h-12 bg-muted/30 rounded-lg mx-auto mb-1 flex items-center justify-center">
                      <Paperclip className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-[10px] text-muted-foreground">{item.file}</p>
                  </div>
                )}
                {item.hasImage && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Record;
