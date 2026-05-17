import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import { useLocation} from "react-router-dom";

function DashboardPage() {
  const [trips, setTrips] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [editingTripId, setEditingTripId] = useState(null);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const name = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
  const email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

  const [viewedUser, setViewedUser] = useState(null);
  const location = useLocation();
  const viewedUserName = location.state?.viewedUserName;
  const params =new URLSearchParams(window.location.search);
  const isAdminView = params.get("admin") === "true";

  const { userId } = useParams();

  const getTrips = async () => {
    try {
      const token = localStorage.getItem("token");

      const endpoint = userId
      ? `https://localhost:7215/api/Trip/user/${userId}`
      : "https://localhost:7215/api/Trip";

      const response = await axios.get(
        endpoint,
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
      toast.error("Failed to load trips.");
    }
  };

  const createTrip = async () => {
    try {
      if(!title || !description || !budget || !startDate || !endDate){
        toast.error("Please fill all fields.");
        return;
      }

      if(Number(budget) < 0){
        toast.error(
          "Budget cannot be negative."
        );
        return;
      }

      if(endDate < startDate) {
        toast.error("End date cannot be before start date.");

        return;
      }

      const token = localStorage.getItem("token");

      await axios.post(
        "https://localhost:7215/api/Trip",
        {
          title,
          description,
          startDate,
          endDate,
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
      setStartDate("");
      setEndDate("");
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
    setStartDate(trip.startDate.slice(0,10));
    setEndDate(trip.endDate.slice(0,10));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const updateTrip = async () => {
    if(Number(budget) < 0){
        toast.error(
          "Budget cannot be negative."
        );
        return;
      }

    if(endDate < startDate) {
        toast.error("End date cannot be before start date.");

        return;
      }

    try{
      const token = localStorage.getItem("token");

      await axios.put(
        `https://localhost:7215/api/Trip/${editingTripId}`,
        {
          id: editingTripId,
          title,
          description,
          startDate,
          endDate,
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
      setStartDate("");
      setEndDate("");
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
    setStartDate("");
    setEndDate("");
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

        <div className="top-strip">
          <div className="top-strip-user">
            👤 {name} • {role}
          </div>

          <button
            className="logout-btn"
            onClick={logout}>
            Logout
          </button>

        </div>


      <div className="container">
        <h1 className="title">My Trips</h1>

        <div className="user-info">

          <div className="role-badge">
            {userId
              ? `👤 ${viewedUserName}`
              : `${role === "Admin"
                  ? "👑 Admin"
                  : "👤 User"} • ${name}`}
          </div>

          {role === "Admin" && (
          <button
            onClick={() =>
              navigate("/admin")}>
            👑 Admin Panel
          </button>
          )}

        </div>

        
        
        {!isAdminView && (
        <div className="form-section">
          
          <div className="dashboard-hero">
            <h2>
              ✈️ Ready for your next adventure?
            </h2>
           
          </div>

          <input
            type="text"
            placeholder="Trip title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}/>

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}/>

          <input
            type="number"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}/>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}/>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}/>

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
          </div>
        )}

        <div className="trip-grid">
          {trips.map((trip) => (
            <div key={trip.id} className="trip-card" >
              
              <h3>
                <span className="trip-emoji">🌴</span>
                {trip.title}</h3>
              <p>{trip.description}</p>
              <p>Budget: {trip.budget}</p>
              
              {!isAdminView && (
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
                  }}>
                  Delete
                </button>

                <button
                  className="details-btn"
                  onClick={() => 
                    navigate( isAdminView ? `/trip/${trip.id}?admin=true`
                                          :`/trip/${trip.id}`)}>
                  🧳 Details
                </button>
              </div>
              )}
            </div>            
          ))}
        </div>        
      </div>     
    </div>
  );
}

export default DashboardPage;