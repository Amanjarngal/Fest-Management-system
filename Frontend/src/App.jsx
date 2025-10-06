import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './pages/Home'
import About from './pages/About'

function App() {
  return (
   <Router>
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/about' element={<About />}/>
      <Route path='*' element={<div>404 Not Found</div>}/>
    </Routes>
   </Router>
  )
}

export default App
