import './App.css';
import ChatBot from './Components/ChatBot';
import CesiumGlobe2 from './Components/MyGlobe';

function App() {
  console.log(process.env.REACT_APP_CESIUM_ION_TOKEN);
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <CesiumGlobe2 />
      <ChatBot />
    </div>
  );
}

export default App;
