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
    }
  };

  const createDestination = async () => {
    try{
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
        }
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

            <button onClick={createDestination}>
                Add Destination
            </button>
        </div>

        <h2 section-title>Destinations</h2>
        <div className="trip-grid">
          {trip.destinations.map((destination) => (
            <div key={destination.id} className="trip-card trip-summary">
              <h3>📍 {destination.name}</h3>

              <p>{destination.location}</p>

              <p>{destination.description}</p>
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


        <h2>Activities</h2>
        <div className="trip-grid">
          {trip.activities.map((activity) => (
            <div key={activity.id} className="trip-card trip-summary">
              <h3>🗓️ {activity.title}</h3>

              <p>{activity.location}</p>

              <p>{activity.description}</p>

              <p>Cost: {activity.estimatedCost}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TripDetailsPage;