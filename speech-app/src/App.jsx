import { Box, Heading } from '@chakra-ui/react';
import SpeechInput from './components/SpeechInput.jsx';

function App() {
  return (
    <Box p={6} maxW="xl" mx="auto" textAlign="center">
      <Heading mb={4}>Voice Notes</Heading>
      <SpeechInput />
    </Box>
  );
}

export default App;
