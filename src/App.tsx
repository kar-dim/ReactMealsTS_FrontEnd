import { Routes, Route } from "react-router-dom"
import Home from "./Home"

//only one Route for now
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={ <Home/> } />
      </Routes>
    </>
  )
}

export default App;