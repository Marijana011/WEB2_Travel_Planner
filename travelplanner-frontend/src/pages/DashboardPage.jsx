import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const [trips, setTrips] = useState([]);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [budget, setBudget] = useState("");

  const navigate = useNavigate();

  const getTrips = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://localhost:7215/api/Trip",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTrips(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createTrip = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://localhost:7215/api/Trip",
        {
          title,
          description,
          startDate: "2026-06-01",
          endDate: "2026-06-10",
          budget: Number(budget),
          notes: "Created from React",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setDescription("");
      setBudget("");

      getTrips();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    window.location.href = "/";
  };

  useEffect(() => {
    getTrips();
  }, []);

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">My Trips</h1>

        <div className="form-section">
          <input
            type="text"
            placeholder="Trip title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <button onClick={createTrip}>Create Trip</button>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="trip-grid">
          {trips.map((trip) => (
            <div key={trip.id} className="trip-card" onClick={() => navigate(`/trip/${trip.id}`)}>
              <h3>{trip.title}</h3>

              <p>{trip.description}</p>

              <p>Budget: {trip.budget}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;