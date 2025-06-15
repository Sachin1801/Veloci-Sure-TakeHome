import SpeechInput from './components/SpeechInput.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-semibold mb-6">Give your voice input below</h1>
      <SpeechInput />
    </div>
  );
}

export default App;
