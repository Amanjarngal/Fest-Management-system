import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GatePass from "./pages/gatepass";

function App() {
  return (
   <Router>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/about' element={<About />}/>
      <Route path='/gatepass' element={<GatePass />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='*' element={<div>404 Not Found</div>}/>
    </Routes>
   </Router>
  )
}

export default App
