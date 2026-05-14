import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../App.css";

function TripDetailsPage() {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [destinationName, setDestinationName] = useState("");
  const [location, setLocation] = useState("");
  const [destinationDescription, setDestinationDescription] = useState("");
  const [editingDestinationId, setEditingDestinationId] = useState(null);

  const [activityTitle, setActivityTitle] = useState("");
  const [activityLocation, setActivityLocation] = useState("");  
  const [activityDescription, setActivityDescription] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");


  const getTrip = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `https://localhost:7215/api/Trip/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTrip(response.data);
    } catch (error) {
      console.log(error);

      if(error.response?.status === 401){
        localStorage.removeItem("token");

        window.location.href = "/";
      }
    }
  };

  const createDestination = async () => {
    try{
        if(!destinationName || !location || !destinationDescription){
          alert("Please fill all fields.");

          return;
        }

        const token = localStorage.getItem("token");

        await axios.post(
            "https://localhost:7215/api/Destination",
            {
                name: destinationName,
                location: location,
                arrivalDate: "2026-06-01",
                departureDate: "2026-06-05",
                description: destinationDescription,
                tripId: id,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        setDestinationName("");
        setLocation("");
        setDestinationDescription("");

        getTrip();
        }catch(error){
            console.log(error);
        }
    };

    const createActivity = async () => {
        try{
            if(!activityTitle || !activityLocation || !activityDescription){
              alert("Please fill all fields.");

              return;
            }


            const token = localStorage.getItem("token");

            await axios.post(
                "https://localhost:7215/api/Activity",
                {
                    title: activityTitle,
                    date: "2026-06-03",
                    time: "18:00",
                    location: activityLocation,
                    description: activityDescription,
                    estimatedCost: Number(estimatedCost),
                    status: "Planned",
                    tripId: id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setActivityTitle("");
            setActivityLocation("");
            setActivityDescription("");
            setEstimatedCost("");

            getTrip();
        }catch (error) {
            console.log(error);

            if(error.response?.status === 401){
              localStorage.removeItem("token");

              window.location.href = "/";
            }
        }
    };

    const deleteDestination = async (destinationId) => {
      try {
        const token = localStorage.getItem("token");

        await axios.delete(
        `https://localhost:7215/api/Destination/${destinationId}`,
        {
          headers: {
          Authorization: `Bearer ${token}`,
          },
        }
      );

      getTrip();
      } catch (error) {
        console.log(error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");

          window.location.href = "/";
        }
      }
  };

  const deleteActivity = async (activityId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `https://localhost:7215/api/Activity/${activityId}`,
        {
          headers: {
          Authorization: `Bearer ${token}`,
          },
        }
      );

      getTrip();
    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");

        window.location.href = "/";
      }
    }
};

const startEditDestination = (destination) => {
  setEditingDestinationId(destination.id);

  setDestinationName(destination.name);
  setLocation(destination.location);
  setDestinationDescription(destination.description);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};  

const updateDestination = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `https://localhost:7215/api/Destination/${editingDestinationId}`,
      {
        id: editingDestinationId,
        name: destinationName,
        location: location,
        arrivalDate: "2026-06-01",
        departureDate: "2026-06-05",
        description: destinationDescription,
        tripId: id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setEditingDestinationId(null);

    setDestinationName("");
    setLocation("");
    setDestinationDescription("");

    getTrip();
  } catch (error) {
    console.log(error);
  }
};


const cancelDestinationEdit = () => {
  setEditingDestinationId(null);

  setDestinationName("");

  setLocation("");

  setDestinationDescription("");
};

  useEffect(() => {
    getTrip();
  }, []);

  if (!trip) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">✈️ {trip.title}</h1>
        

        <div className="trip-card trip-summary">
          <p>{trip.description}</p>

          <p>Budget: {trip.budget}</p>

          <p>
            {trip.startDate.slice(0, 10)} -{" "}
            {trip.endDate.slice(0, 10)}
          </p>
        </div>

        <div className="form-section">
            <input 
                type="text"
                placeholder="Destination name"
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}>
            </input>

            <input 
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}>
            </input>

            <input 
                type="text"
                placeholder="Description"
                value={destinationDescription}
                onChange={(e) => setDestinationDescription(e.target.value)}>
            </input>


            <div className="card-buttons">
              {editingDestinationId ? (
              <button onClick={updateDestination}>
                  Save Destination
              </button>
              ) : (
              <button onClick={createDestination}>
                  Add Destination
              </button>
              )}

              {editingDestinationId && (
                <button
                  className="cancel-btn"
                  onClick={cancelDestinationEdit}
                >
                  Cancel
                </button>
              )}
            </div>
        </div>

        <h2 className="section-title">Destinations</h2>
        <div className="trip-grid">
          {trip.destinations.map((destination) => (
            <div key={destination.id} className="trip-card trip-summary">
              <h3><span className="emoji">📍</span> {destination.name}</h3>

              <p>{destination.location}</p>

              <p>{destination.description}</p>

              <div className="card-buttons">
                <button
                  className="edit-btn"
                  onClick={() => startEditDestination(destination)}>
                    Edit
                </button>

                <div className="card-buttons">
                  <button
                    className="delete-btn"
                    onClick={() => deleteActivity(activity.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="form-section"> 
          <input
            type="text"
            placeholder="Activity title"
            value={activityTitle}
            onChange={(e) => setActivityTitle(e.target.value)}>
          </input>

          <input
            type="text"
            placeholder="Location"
            value={activityLocation}
            onChange={(e) => setActivityLocation(e.target.value)}>
          </input>

          <input
            type="text"
            placeholder="Description"
            value={activityDescription}
            onChange={(e) => setActivityDescription(e.target.value)}>
          </input>

          <input
            type="number"
            placeholder="Estimated cost"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}>
          </input>

          <button onClick={createActivity}> 
            Add Activity
          </button>
        </div>


        <h2 className="section-title">Activities</h2>
        <div className="trip-grid">
          {[...trip.activities].reverse().map((activity) => (
            <div key={activity.id} className="trip-card trip-summary">
              <h3>🗓️ {activity.title}</h3>

              <p>{activity.location}</p>

              <p>{activity.description}</p>

              <p>Cost: {activity.estimatedCost}</p>

              <div className="card-buttons">
                <button
                  className="delete-btn"
                  onClick={() => deleteActivity(activity.id)}
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

export default TripDetailsPage;