import CustomCursor from "./components/CustomCursor"
import Header from "./components/Header"
import './App.css'
import Preloader from "./components/Preloader"

const App: React.FC = () => {
  return (
    <div className="text-white">
      <Preloader />
      <Header />
      <CustomCursor />
      <div id="intro" className="w-screen h-72 bg-red-800 mt-32">intro</div>
      <div id="benefits" className="w-screen h-72 bg-red-800 mt-32">Benefits</div>
      <div id="functions" className="w-screen h-72 bg-red-800 mt-32">Functions</div>
      <div id="vizualization" className="w-screen h-72 bg-red-800 mt-32">Vizualization</div>
      <div id="vizualization" className="w-screen h-72 bg-red-950 mt-32">Footer</div>
    </div>
  )
}

export default App
