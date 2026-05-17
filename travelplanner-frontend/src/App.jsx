import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import DashboardPage from "./pages/DashboardPage";
import TripDetailsPage from "./pages/TripDetailsPage";
import SharedTripPage from "./pages/SharedTripPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useParams } from "react-router-dom";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/admin" element={<ProtectedRoute> <AdminPage/> </ProtectedRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute> <DashboardPage/> </ProtectedRoute>} />

        <Route path="/dashboard/:userId" element={<ProtectedRoute> <DashboardPage /> </ProtectedRoute>}/>

        <Route path="/trip/:id" element={<ProtectedRoute> <TripDetailsPage /> </ProtectedRoute>} />
      
        <Route path="/shared/:token" element={<SharedTripPage />}/>
      </Routes>
  );
}

export default App;