import { Box, Heading } from '@chakra-ui/react';
import SpeechInput from './components/SpeechInput.jsx';

function App() {
  return (
    <Box p={6} w="100%" textAlign="center" display="flex" flexDir="column" alignItems="center" justifyContent="center" minH="100vh">
      <Heading mb={6} size="lg">Give your voice input below</Heading>
      <SpeechInput />
    </Box>
  );
}

export default App;
