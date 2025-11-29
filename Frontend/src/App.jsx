import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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
import CartPage from "./pages/CartPage";
import PerformerDashboard from "./pages/Dashboard/PerformerDashboard";
import FeedbackDashboard from "./pages/Dashboard/FeedbackDashboard";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import AnnouncementDashboard from "./pages/Dashboard/AnnouncementDashboard";
import Stalls from "./pages/Dashboard/Stalls";
import PublicRoute from "./context/PublicRoute";
import StallDetails from "./pages/StallDetails";
// import StallsList from "./pages/StallsList";
import MyAccount from "./pages/MyAccount";
import SuccessPage from "./components/Payment comp/SuccessPage";
import CancelPage from "./components/Payment comp/CancelPage";
import StallOrdersDashboard from "./pages/Dashboard/StallOrdersDashboard";
import EventOrdersDashboard from "./pages/Dashboard/EventOrdersDashboard";
import StallPage from "./pages/StallPage";
import Contactus from "./pages/Contactus";
import StallOwnerDashboard from "./pages/StallOwnerDashboard";

function AppContent() {
  const location = useLocation();

  // ❌ Hide footer on these routes
  const hideFooterRoutes = ["/login", "/signup"];
  const isDashboard = location.pathname.startsWith("/dashboard");
  const hideFooter = hideFooterRoutes.includes(location.pathname) || isDashboard;

  return (
    <>
     {/* Toast Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
          },
          success: {
            iconTheme: {
              primary: "#ec4899", // pink
              secondary: "#111",
            },
          },
        }}
      />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />

        {/* protected routes */}
        <Route path="/stalls" element={
          <ProtectedRoute> <StallPage /> </ProtectedRoute> 
          } />

          <Route path="/stall/:id" element={<StallDetails />} />

        <Route
          path="/voting"
          element={<ProtectedRoute><VotingZone /></ProtectedRoute>}
        />

        <Route path='/login' element= {<PublicRoute> <Login /> </PublicRoute>   } />
        <Route path='/signup' element={  <PublicRoute><Signup /> </PublicRoute>} />
        <Route path="/account" element={<MyAccount />} />
        <Route path='/gallery' element={<Gallery />} />
        <Route path='/eventSchedules' element={<EventSchedule />} />
        <Route path='/pricing/:eventId' element={<PricingPage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/contact' element={<Contactus />} />
        <Route path="/stall-dashboard" element={<StallOwnerDashboard />} />


        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />

        <Route path='*' element={ <NotFound /> } />

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
          <Route path="eventOrder" element={<EventOrdersDashboard />} />
          <Route path="pricingSet" element={<PricingDashboard />} />
          <Route path="performers" element={<PerformerDashboard />} />
          <Route path="feedback" element={<FeedbackDashboard />} />
          <Route path="announcement" element={<AnnouncementDashboard />} />
          <Route path="stalls" element={<Stalls />} />
          <Route path="stallsOrder" element={<StallOrdersDashboard />} />

        </Route>
      </Routes>

      {/* ✅ Conditionally render Footer */}
      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
