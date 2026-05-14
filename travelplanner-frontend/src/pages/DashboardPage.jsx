import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function DashboardPage() {
  const [trips, setTrips] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [editingTripId, setEditingTripId] = useState(null);
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

      if(error.response?.status === 401){
        localStorage.removeItem("token");

        window.location.href = "/";
      }
    }
  };

  const createTrip = async () => {
    try {
      if(!title || !description || !budget){
        toast.error("Please fill all fields.");

        return;
      }

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
      toast.success("Trip created!");

      getTrips();
    } catch (error) {
      console.log(error);

      if(error.response?.status === 401){
        localStorage.removeItem("token");

        window.location.href = "/";
      }
    }
  };

  const deleteTrip = async (tripId) => {
    const confirmed = window.confirm("Are you sure you want to delete this trip?");

    if (!confirmed) {
      return;
    }

    try{
      const token = localStorage.getItem("token");

      await axios.delete(
        `https://localhost:7215/api/Trip/${tripId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getTrips();
      toast.success("Trip deleted!");
    }catch (error){
      console.log(error);

      if(error.response?.status === 401){
        localStorage.removeItem("token");

        window.location.href = "/";
      }
    }
  };

  const startEditTrip = (trip) => {
    setEditingTripId(trip.id);
    
    setTitle(trip.title);
    setDescription(trip.description);
    setBudget(trip.budget);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const updateTrip = async () => {
    try{
      const token = localStorage.getItem("token");

      await axios.put(
        `https://localhost:7215/api/Trip/${editingTripId}`,
        {
          id: editingTripId,
          title,
          description,
          startDate: "2026-06-01",
          endDate: "2026-06-10",
          budget: Number(budget),
          notes: "Updated from React",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingTripId(null);

      setTitle("");
      setDescription("");
      setBudget("");
      toast.success("Trip updated!");

      getTrips();
    }catch(error) {
      console.log(error);
    }
  };


  const cancelEditing = () => {
    setEditingTripId(null);
    setTitle("");
    setDescription("");
    setBudget("");
  };

  const logout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if(!confirmed){
      return;
    }

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

          {editingTripId ? (
            <button onClick={updateTrip}>
              Save Changes
            </button>
            ) : (
            <button onClick={createTrip}>
              Create Trip
            </button>
          )}

          {editingTripId && (
          <button
            className="cancel-btn"
            onClick={cancelEditing}>
              Cancel
          </button>
          )}

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

              <div className="card-buttons">
                <button
                  className="edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();

                    startEditTrip(trip);
                  }}>
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();

                    deleteTrip(trip.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;