import { IconButton, Button, Textarea, Stack, Box } from '@chakra-ui/react';
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
    <Stack direction={{ base: 'column', md: 'row' }} spacing={4} align="center" justify="center">
      <IconButton
        className={`icon-button ${listening ? 'active-mic' : ''}`}
        icon={<MdMic />}
        aria-label={listening ? 'Stop voice input' : 'Start voice input'}
        aria-pressed={listening}
        onClick={handleMic}
        bg={listening ? 'red.500' : 'teal.500'}
        _hover={{ bg: listening ? 'red.600' : 'teal.600' }}
        color="white"
        size="lg"
      />
      <Button
        onClick={resetTranscript}
        variant="solid"
        bg="gray.600"
        _hover={{ bg: 'gray.700', textShadow: '0 0 6px rgba(255,255,255,0.8)' }}
        color="white"
        className="reset-btn"
      >
        Reset
      </Button>
      <Textarea
        id="transcript"
        name="transcript"
        aria-label="Transcript"
        readOnly
        value={transcript}
        placeholder="Press the mic and speak…"
        resize="vertical"
        minH="120px"
        bg="white"
        color="gray.800"
      />
      <Box fontSize="sm" color="gray.500" textAlign="center" w="full">
        Click the microphone to start or stop recording
      </Box>
    </Stack>
  );
}

export default SpeechInput; 