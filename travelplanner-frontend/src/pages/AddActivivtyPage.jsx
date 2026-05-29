import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../App.css";

function AddActivityPage() {

  const { id, activityId  } = useParams();

  const navigate = useNavigate();

  const [activityTitle, setActivityTitle] = useState("");
  const [activityLocation, setActivityLocation] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [activityTime, setActivityTime] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Planned");
  const [category, setCategory] = useState("Other");
  const [trip, setTrip] = useState(null);

  const createActivity = async () => {

    try {

      if (!activityTitle || !activityLocation || !activityDescription || !activityDate || !activityTime
      ) {
        toast.error("Please fill all fields.");
        return;
      }

      const token = localStorage.getItem("token");

      const tripStart = new Date(trip.startDate);
      const tripEnd = new Date(trip.endDate);

      const activityDay = new Date(activityDate);
      if(activityDay < tripStart || activityDay > tripEnd)
      {
        toast.error("Activity date must be within trip dates.");
        return;
      }

      await axios.post(
        "https://localhost:7215/api/Activity",
        {
          title: activityTitle,
          date: activityDate,
          time: activityTime,
          location: activityLocation,
          description: activityDescription,
          estimatedCost: Number(estimatedCost),
          notes,
          status,
          category,
          tripId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Activity added!");

      navigate(`/trip/${id}`);

    } catch (error) {
      console.log(error);
      toast.error("Failed to create activity.");
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

  const getActivity = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `https://localhost:7215/api/Activity/single/${activityId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const activity = response.data;

  setActivityTitle(activity.title);
  setActivityLocation(activity.location);
  setActivityDescription(activity.description);
  setEstimatedCost(activity.estimatedCost);
  setActivityDate(activity.date.slice(0,10));
  setActivityTime(activity.time);
  setNotes(activity.notes);
  setStatus(activity.status);
  setCategory(activity.category);
};

const updateActivity = async () => {

  try {

    const token = localStorage.getItem("token");

    await axios.put(
      `https://localhost:7215/api/Activity/${activityId}`,
      {
        id: activityId,

        title: activityTitle,
        location: activityLocation,
        description: activityDescription,

        estimatedCost:Number(estimatedCost),

        date: activityDate,
        time: activityTime,

        notes,
        status,
        category,

        tripId: id,
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    toast.success(
      "Activity updated!"
    );

    navigate(`/trip/${id}`);

  } catch(error) {

    console.log(error);

    toast.error(
      "Update failed."
    );
  }
};


useEffect(() => {

    getTrip();

    if(activityId){
        getActivity();
    }
}, [activityId]);

  return (
    <div className="edit-page">

        <div className="form-background">

          <div className="form-section">

            <h1 className="title">
              {activityId 
                ? "Edit Activity"
                : "Add Activity"}
            </h1>

            <input
              type="text"
              placeholder="Activity title"
              value={activityTitle}
              onChange={(e) =>
                setActivityTitle(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Location"
              value={activityLocation}
              onChange={(e) =>
                setActivityLocation(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Description"
              value={activityDescription}
              onChange={(e) =>
                setActivityDescription(e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Estimated cost"
              value={estimatedCost}
              onChange={(e) =>
                setEstimatedCost(e.target.value)
              }
            />

            <input
              type="date"
              min={trip?.startDate?.slice(0,10)}
              max={trip?.endDate?.slice(0,10)}
              value={activityDate}
              onChange={(e) =>
                setActivityDate(e.target.value)
              }
            />

            <input
              type="time"
              value={activityTime}
              onChange={(e) =>
                setActivityTime(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Notes"
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option value="Planned">
                Planned
              </option>

              <option value="Reserved">
                Reserved
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <option value="Transport">
                Transport
              </option>

              <option value="Accommodation">
                Accommodation
              </option>

              <option value="Food">
                Food
              </option>

              <option value="Tickets">
                Tickets
              </option>

              <option value="Shopping">
                Shopping
              </option>

              <option value="Other">
                Other
              </option>
            </select>

            <button onClick={activityId 
                                ? updateActivity
                                : createActivity
            }>
             {activityId
                ? "Save Activity"
                : "Add Activity"}
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

export default AddActivityPage;