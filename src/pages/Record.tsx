import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { X, Mic, Camera, Image, Type, Paperclip, FlipHorizontal, Settings } from 'lucide-react';
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

  // Activation screen before camera
  if (!cameraActivated) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        {/* Close button */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-safe z-10 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Blurred background image */}
        <div className="flex-1 relative flex items-center justify-center">
          <img
            src={cameraBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
          />
          <div className="absolute inset-0 bg-black/30" />
          
          <div className="relative z-10 text-center px-8">
            <p className="text-white text-lg font-medium leading-relaxed mb-8">
              Enregistrez-vous entrain de chanter et partager à vos amis pour 5 crédits à gagner
            </p>
            <button
              onClick={() => setCameraActivated(true)}
              className="px-8 py-4 rounded-full bg-white text-black font-bold text-base"
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
      {/* Camera Preview */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-safe flex items-center justify-between">
          <button
            onClick={() => {
              stream?.getTracks().forEach(track => track.stop());
              navigate(-1);
            }}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={flipCamera}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
            >
              <FlipHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-black/90 backdrop-blur-xl px-6 py-6 pb-safe">
        <div className="flex items-center justify-around mb-6">
          <button className="flex flex-col items-center gap-1 opacity-70">
            <Image className="w-6 h-6 text-white" />
          </button>
          <button className="flex flex-col items-center gap-1 opacity-70">
            <Mic className="w-6 h-6 text-white" />
          </button>
          <button className="flex flex-col items-center gap-1 opacity-70">
            <Type className="w-6 h-6 text-white" />
          </button>
          <button className="flex flex-col items-center gap-1 opacity-70">
            <Paperclip className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex items-center justify-center">
          <button onClick={toggleRecording} className="relative">
            <div className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all ${isRecording ? 'scale-110' : ''}`}>
              <div className={`rounded-full transition-all ${isRecording ? 'w-8 h-8 rounded-lg bg-red-500' : 'w-16 h-16 bg-white'}`} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Record;
