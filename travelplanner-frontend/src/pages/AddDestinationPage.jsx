import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../App.css";
import "../FormPages.css";

function AddDestinationPage() {

  const { id, destinationId } = useParams();

  const navigate = useNavigate();

  const [destinationName, setDestinationName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [trip, setTrip] = useState(null);

  const createDestination = async () => {
    try {

      if (!destinationName || !location || !description || !arrivalDate || !departureDate) {
        toast.error("Please fill all fields.");
        return;
      }
      
      const token = localStorage.getItem("token");

      await axios.post(
        "https://localhost:7215/api/Destination",
        {
          name: destinationName,
          location,
          description,
          arrivalDate,
          departureDate,
          tripId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Destination added!");

      navigate(`/trip/${id}`);

    } catch (error) {
      console.log(error);
      toast.error("Failed to create destination.");
    }
  };


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

    } catch(error) {

        console.log(error);
    }
  };


  const getDestination = async () => {const token = localStorage.getItem("token");
    
        const response = await axios.get(
        `https://localhost:7215/api/Destination/single/${destinationId}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );

    const destination = response.data;

    setDestinationName(destination.name);
    setLocation(destination.location);
    setDescription(destination.description);
    setArrivalDate(destination.arrivalDate.slice(0,10));
    setDepartureDate(destination.departureDate.slice(0,10));
    };

    const updateDestination = async () => {

    try {

        const token = localStorage.getItem("token");

        await axios.put(
        `https://localhost:7215/api/Destination/${destinationId}`,
        {
            id: destinationId,
            name: destinationName,
            location,
            description,
            arrivalDate,
            departureDate,
            tripId: id,
        },
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        toast.success("Destination updated!");

        navigate(`/trip/${id}`);

    } catch(error) {

        console.log(error);

        toast.error("Update failed.");
    }
  };

useEffect(() => {

  getTrip();

  if(destinationId){
    getDestination();
  }

}, [destinationId]);

  return (
    <div className="edit-page">

      

        <div className="form-background">

          <div className="form-section">

            <h1 className="title">
              {destinationId
                ? "Edit Destination"
                : "Add Destination"}
            </h1>

            <input
              type="text"
              placeholder="Destination name"
              value={destinationName}
              onChange={(e) =>
                setDestinationName(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

            <input
              type="date"
              min={trip?.startDate?.slice(0,10)}
              max={trip?.endDate?.slice(0,10)}
              value={arrivalDate}
              onChange={(e) =>
                setArrivalDate(e.target.value)
              }
            />

            <input
              type="date"
              min={arrivalDate ||trip?.startDate?.slice(0,10)}
              max = {trip?.endDate?.slice(0,10)}
              value={departureDate}
              onChange={(e) =>
                setDepartureDate(e.target.value)
              }
            />

            <button onClick={destinationId ? updateDestination
                                           : createDestination}>
              {destinationId
                ? "Save Destination"
                : "Add Destination"}
            </button>

            <button
              className="cancel-btn"
              onClick={() =>
                navigate(`/trip/${id}`)
              }
            >
              Cancel
            </button>

          </div>
        </div>
      </div>
  );
}

export default AddDestinationPage;