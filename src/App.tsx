import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import micPressSound from '../assets/mic-press.mp3';
import micOffSound from '../assets/mic-off.mp3';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type RecordingState = 'idle' | 'listening' | 'processing' | 'error';

function App() {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [speechCompleted, setSpeechCompleted] = useState(false);
  const placeholderFull = 'Type here or click the microphone to start speaking...';
  const [placeholderText, setPlaceholderText] = useState('');
  const recognitionRef = useRef<any>(null);
  const micOnAudioRef = useRef<HTMLAudioElement | null>(null);
  const micOffAudioRef = useRef<HTMLAudioElement | null>(null);
  const hadSpeechRef = useRef(false);
  const stripes = Array.from({ length: 25 });
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const MAX_TEXTAREA_HEIGHT = 200; // about 5 lines

  useEffect(() => {
    // initialise mic press audio
    micOnAudioRef.current = new Audio(micPressSound);
    micOffAudioRef.current = new Audio(micOffSound);

    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.');
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setRecordingState('listening');
      setError('');
      hadSpeechRef.current = false;
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => {
          const separator = prev && !/\s$/.test(prev) ? ' ' : '';
          return prev + separator + finalTranscript;
        });
        hadSpeechRef.current = true;
      }
      setInterimTranscript(interimTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setRecordingState('error');
      
      switch (event.error) {
        case 'no-speech':
          setError('No speech detected. Please try again.');
          break;
        case 'audio-capture':
          setError('Microphone access denied or unavailable.');
          break;
        case 'not-allowed':
          setError('Microphone permission denied. Please allow microphone access.');
          break;
        case 'network':
          setError('Network error. Please check your connection.');
          break;
        default:
          setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setRecordingState('idle');
      setInterimTranscript('');

      if (hadSpeechRef.current) {
        setSpeechCompleted(true);
      }
    };

    recognitionRef.current = recognition;

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;

    if (recordingState === 'listening') {
      // play mic off sound
      if (micOffAudioRef.current) {
        micOffAudioRef.current.currentTime = 0;
        micOffAudioRef.current.play();
      }
      recognitionRef.current.stop();
    } else {
      setError('');
      setRecordingState('processing');
      recognitionRef.current.start();

      // play mic on sound
      if (micOnAudioRef.current) {
        micOnAudioRef.current.currentTime = 0;
        micOnAudioRef.current.play();
      }
    }
  }, [isSupported, recordingState]);

  // keyboard shortcut 'y'
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        toggleRecording();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [toggleRecording]);

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setError('');
    setSpeechCompleted(false);
  };

  // auto-grow textarea within limit
  const adjustTextarea = () => {
    if (!textareaRef.current) return;
    const ta = textareaRef.current;
    ta.style.height = 'auto';
    const newHeight = Math.min(ta.scrollHeight, MAX_TEXTAREA_HEIGHT);
    ta.style.height = `${newHeight}px`;
    ta.style.overflowY = ta.scrollHeight > MAX_TEXTAREA_HEIGHT ? 'auto' : 'hidden';
  };

  useEffect(() => {
    adjustTextarea();
  }, [transcript, interimTranscript]);

  const getStateIcon = () => {
    switch (recordingState) {
      case 'listening':
        return <Mic className="w-6 h-6" />;
      case 'processing':
        return <Volume2 className="w-6 h-6 animate-pulse" />;
      case 'error':
        return <MicOff className="w-6 h-6" />;
      default:
        return <Mic className="w-6 h-6" />;
    }
  };

  const getStateColor = () => {
    switch (recordingState) {
      case 'listening':
        return 'bg-red-500 hover:bg-red-600 shadow-red-200';
      case 'processing':
        return 'bg-blue-500 hover:bg-blue-600 shadow-blue-200';
      case 'error':
        return 'bg-gray-400 cursor-not-allowed';
      default:
        return 'bg-blue-500 hover:bg-blue-600 shadow-blue-200';
    }
  };

  const getStatusMessage = () => {
    switch (recordingState) {
      case 'listening':
        return 'Listening... Click to stop';
      case 'processing':
        return 'Starting microphone...';
      case 'error':
        return error;
      default:
        return 'Click the microphone to start speaking';
    }
  };

  // looping typewriter placeholder until user adds text
  useEffect(() => {
    if (transcript !== '') return; // stop when user typed/spoke

    let idx = 0;
    const interval = setInterval(() => {
      idx += 1;
      if (idx > placeholderFull.length) {
        idx = 0;
      }
      setPlaceholderText(placeholderFull.slice(0, idx));
    }, 60);
    return () => clearInterval(interval);
  }, [transcript]);

  return (
    <div className="min-h-screen relative transition-colors duration-300">
      {/* animated background stripes */}
      <div className="bg-stripes">
        {stripes.map((_, i) => (
          <span key={i} className="rainbow" style={{ animationDelay: `-${(i/25)*45}s`, animationDuration:'45s'}} />
        ))}
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1
            className="text-4xl font-bold mb-2 text-3d text-blue-600"
          >
            VoiceScribe
          </h1>
          {/* Gooey marquee subtitle */}
          <div className="marquee mx-auto max-w-xl">
            {/* Blurred edge mask */}
            {/* <div className="marquee_blur">
              <p className="text-base sm:text-lg font-medium text-gray-700">
                Transform your speech into text with real-time transcription ✨
              </p>
            </div> */}
            {/* Scrolling crisp text */}
            <div className="marquee_text">
              <p className="text-base sm:text-lg font-medium text-gray-700">
                Transform your speech into text with real-time transcription ✨
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl w-full">
          {/* Transcription Display */}
          <div className="relative bg-white/75 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/60 mb-6 overflow-hidden">
            {/* Inward pulse on transcription container */}
            {recordingState === 'listening' && (
              <>
                <span className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-green-400/40 animate-siri-pulse-in"></span>
                <span className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-green-400/30 animate-siri-pulse-in" style={{ animationDelay: '1s' }}></span>
              </>
            )}
            <div className="relative p-6 border-b border-gray-100 transition-colors duration-300">
              {/* Clear button */}
              {transcript && (
                <button
                  onClick={clearTranscript}
                  className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition-colors z-10"
                >
                  Clear
                </button>
              )}
            </div>
            
            <div className="p-6">
              <textarea
                ref={textareaRef}
                className="w-full min-h-[40px] max-h-[200px] text-base leading-relaxed text-gray-800 border border-gray-200/50 bg-white/45 backdrop-blur-sm rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors duration-300"
                placeholder={placeholderText}
                value={transcript}
                onChange={(e) => {
                  setTranscript(e.target.value);
                  if (speechCompleted) setSpeechCompleted(false);
                  adjustTextarea();
                }}
              />

              {/* Embedded mic button bottom-right */}
              <div className="relative">
                <button
                  onClick={toggleRecording}
                  disabled={!isSupported || recordingState === 'error'}
                  className={`
                    group absolute bottom-4 right-4 flex flex-col items-center space-y-1 focus:outline-none
                    ${!isSupported || recordingState === 'error' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                  `}
                >
                  <span
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md
                      ${getStateColor()} transition-transform duration-200
                      ${recordingState === 'listening' ? 'scale-110' : 'hover:scale-105'}
                    `}
                  >
                    {getStateIcon()}
                    {recordingState === 'listening' && (
                      <>
                        <span className="absolute inset-0 rounded-full bg-green-400/40 animate-siri-pulse-sm"></span>
                        <span className="absolute inset-0 rounded-full bg-green-400/30 animate-siri-pulse-sm" style={{ animationDelay: '0.8s' }}></span>
                      </>
                    )}
                  </span>
                  {recordingState === 'error' && (
                    <span className="text-xs font-medium text-red-600 mt-1">
                      {getStatusMessage()}
                    </span>
                  )}
                </button>
              </div>

              {/* Interim transcript hidden from separate display as requested */}
            </div>
          </div>

          {/* Quick Guide (moved) */}
          <div className="bg-blue-50 rounded-xl p-6 w-full max-w-4xl">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Quick Guide</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xs">1</div>
                <p>Type directly into the box or tap the mic to start voice input. Use the 'y' key to start/stop the mic.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xs">2</div>
                <p>Speak clearly — your words appear instantly after your existing text.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xs">3</div>
                <p>Stop the mic, then continue typing or speaking any time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;