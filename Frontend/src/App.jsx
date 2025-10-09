import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GatePass from "./pages/gatepass";
import VotingZone from "./pages/VotingZone";
import ProtectedRoute from "./components/ProtectedRoute";
import Gallery from "./pages/Gallery";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        {/* protected routes */}
        <Route path='/gatepass' element={<ProtectedRoute><GatePass /></ProtectedRoute>} />
        <Route path="/voting"  element={ <ProtectedRoute> <VotingZone />  </ProtectedRoute>  }  />

        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/gallery' element={<Gallery />} />
        <Route path='*' element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  )
}

export default App
