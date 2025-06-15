import { Box, Button, Alert } from '@chakra-ui/react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SpeechInput = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Toggle microphone listening
  const handleMic = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <Alert status="error">Browser does not support voice input.</Alert>;
  }

  return (
    <Box>
      <Button onClick={handleMic} mr={2} colorScheme={listening ? 'red' : 'teal'}>
        {listening ? 'Stop 🎙️' : 'Start 🎤'}
      </Button>
      <Button onClick={resetTranscript} variant="outline" mr={2}>
        Reset
      </Button>
      <Box mt={4}>{transcript || 'Press the mic and speak…'}</Box>
    </Box>
  );
};

export default SpeechInput; 