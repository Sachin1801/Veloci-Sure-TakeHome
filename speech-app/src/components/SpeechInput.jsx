import { IconButton, Button, Textarea, Stack } from '@chakra-ui/react';
import { Alert } from '@chakra-ui/react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { MdMic } from 'react-icons/md';

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
    return <Alert status="error">Browser does not support voice input.</Alert>;
  }

  return (
    <Stack direction={{ base: 'column', md: 'row' }} spacing={4} align="start">
      <IconButton
        className="icon-button"
        icon={<MdMic />}
        aria-label="Record"
        aria-pressed={listening}
        onClick={handleMic}
        colorScheme={listening ? 'red' : 'blue'}
      />
      <Button onClick={resetTranscript} variant="outline">
        Reset
      </Button>
      <Textarea
        isReadOnly
        value={transcript}
        placeholder="Press the mic and speak…"
        resize="vertical"
        minH="120px"
      />
    </Stack>
  );
}

export default SpeechInput; 