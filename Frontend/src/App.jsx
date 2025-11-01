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
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import UsersPage from "./pages/Dashboard/UsersPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import AdminRoute from "./components/AdminRoute";
import ImagesPage from "./pages/Dashboard/ImagesPage";
import MakeAdmin from "./pages/Dashboard/MakeAdmin";
import DashboardLeaderboard from "./pages/Dashboard/DashboardLeaderboard";
import Participants from "./pages/Dashboard/Participants";
import EventsDashboard from "./pages/Dashboard/EventsDashboard";
import EventSchedule from "./pages/EventSchedule";
import PricingDashboard from "./pages/Dashboard/PricingDashboard";
import PricingPage from "./pages/PricingSection";

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
        <Route path='/eventSchedules' element={<EventSchedule />} />
        <Route path='/pricing' element={<PricingPage />} />

        <Route path='*' element={<div>404 Not Found</div>} />


        {/* Admin Routes */}
        <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <DashboardLayout />
          </AdminRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="make-admin" element={<MakeAdmin />} />
        <Route path="images" element={<ImagesPage />} />
        <Route path="participants" element={<Participants />} />
        <Route path="leaderboard" element={<DashboardLeaderboard />} />
        <Route path="events" element={<EventsDashboard />} />
        <Route path="pricingSet" element={<PricingDashboard />} />
        {/* <Route path="services" element={<ServicesPage />} /> */}
      </Route>
      </Routes>
    </Router>
  )
}

export default App
