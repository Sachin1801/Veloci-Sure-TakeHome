import { MdMic } from 'react-icons/md';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function SpeechInput() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleMic = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <p className="text-red-600">Browser does not support voice input.</p>;
  }

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-4">
      <button
        className={`icon-button ${listening ? 'active-mic' : ''} w-12 h-12 rounded-lg flex items-center justify-center text-white ${listening ? 'bg-red-500' : 'bg-teal-500'} hover:brightness-110`}
        aria-label={listening ? 'Stop voice input' : 'Start voice input'}
        aria-pressed={listening}
        onClick={handleMic}
      >
        <MdMic size={24} />
      </button>

      <button
        onClick={resetTranscript}
        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
      >
        Reset
      </button>

      <textarea
        id="transcript"
        name="transcript"
        aria-label="Transcript"
        readOnly
        value={transcript}
        placeholder="Press the mic and speak…"
        className="w-full min-h-[120px] p-3 border rounded resize-vertical text-gray-800"
      />

      <p className="text-sm text-gray-500 text-center">Click the microphone to start or stop recording</p>
    </div>
  );
}

export default SpeechInput; 