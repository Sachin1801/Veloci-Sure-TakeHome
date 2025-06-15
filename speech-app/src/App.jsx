import { ChakraProvider, Box, Heading, extendTheme } from '@chakra-ui/react';
import SpeechInput from './components/SpeechInput.jsx';

const theme = extendTheme({});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box p={6} maxW="xl" mx="auto" textAlign="center">
        <Heading mb={4}>Voice Notes</Heading>
        <SpeechInput />
      </Box>
    </ChakraProvider>
  );
}

export default App;
