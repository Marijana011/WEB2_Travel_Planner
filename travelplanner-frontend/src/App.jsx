import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TripDetailsPage from "./pages/TripDetailsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/dashboard" element={<ProtectedRoute> <DashboardPage/> </ProtectedRoute>} />

        <Route path="/trip/:id" element={<ProtectedRoute> <TripDetailsPage /> </ProtectedRoute>} />
      </Routes>
  );
}

export default App;