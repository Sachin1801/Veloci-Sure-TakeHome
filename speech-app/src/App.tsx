import { ChakraProvider, Box, Heading } from '@chakra-ui/react';
import SpeechInput from './components/SpeechInput';

function App() {
  return (
    <ChakraProvider>
      <Box p={6} maxW="xl" mx="auto" textAlign="center">
        <Heading mb={4}>Voice Notes</Heading>
        <SpeechInput />
      </Box>
    </ChakraProvider>
  );
}

export default App; 