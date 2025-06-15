import { ChakraProvider, Box, Heading, defaultSystem } from '@chakra-ui/react';
import SpeechInput from './components/SpeechInput.jsx';

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <Box p={6} maxW="xl" mx="auto" textAlign="center">
        <Heading mb={4}>Voice Notes</Heading>
        <SpeechInput />
      </Box>
    </ChakraProvider>
  );
}

export default App;
