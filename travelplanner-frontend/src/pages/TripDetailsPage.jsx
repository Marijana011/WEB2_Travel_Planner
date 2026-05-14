import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../App.css";
import { toast } from "react-toastify";

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
  const [editingActivityId, setEditingActivityId] = useState(null);

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
          toast.error("Please fill all fields.");

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
        toast.success("Destination added!");

        getTrip();
        }catch(error){
            console.log(error);
        }
    };

    const createActivity = async () => {
        try{
            if(!activityTitle || !activityLocation || !activityDescription){
              toast.error("Please fill all fields.");

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
            toast.success("Activity added!");

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
      const confirmed = window.confirm("Are you sure you want to delete this destination?");

      if (!confirmed) {
        return;
      }
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
      toast.success("Destination deleted!");
      } catch (error) {
        console.log(error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");

          window.location.href = "/";
        }
      }
  };

  const deleteActivity = async (activityId) => {
    const confirmed = window.confirm("Are you sure you want to delete this activity?");

      if (!confirmed) {
        return;
      }
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
      toast.success("Activity deleted!");
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

const startEditActivity = (activity) => {
  setEditingActivityId(activity.id);

  setActivityTitle(activity.title);
  setActivityLocation(activity.location);
  setActivityDescription(activity.description);
  setEstimatedCost(activity.estimatedCost);

  window.scrollTo({
    top: document.body.scrollHeight,
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
    toast.success("Destination updated!");

    getTrip();
  } catch (error) {
    console.log(error);
  }
};

const updateActivity = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `https://localhost:7215/api/Activity/${editingActivityId}`,
      {
        id: editingActivityId,
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

    setEditingActivityId(null);
    setActivityTitle("");
    setActivityLocation("");
    setActivityDescription("");
    setEstimatedCost("");
    toast.success("Activity updated!");

    getTrip();
  } catch (error) {
    console.log(error);
  }
};

const cancelDestinationEdit = () => {
  setEditingDestinationId(null);
  setDestinationName("");
  setLocation("")
  setDestinationDescription("");
};

const cancelActivityEdit = () => {
  setEditingActivityId(null);
  setActivityTitle("");
  setActivityLocation("");
  setActivityDescription("");
  setEstimatedCost("");
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


            <div className="form-buttons">
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
                  onClick={cancelDestinationEdit}>
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

                <button
                  className="delete-btn"
                  onClick={() => deleteDestination(destination.id)}>
                    Delete
                </button>
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

          <div className="form-buttons">
            {editingActivityId ? (
              <button onClick={updateActivity}>
                Save Activity
              </button>
            ) : (
              <button onClick={createActivity}>
                Add Activity
              </button>
            )}

            {editingActivityId && (
              <button
                className="cancel-btn"
                onClick={cancelActivityEdit}
              >
                Cancel
              </button>
            )}
          </div>
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
                  className="edit-btn"
                  onClick={() => startEditActivity(activity)}>
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteActivity(activity.id)}>
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