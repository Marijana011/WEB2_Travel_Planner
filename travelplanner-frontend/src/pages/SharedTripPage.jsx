import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../App.css";

function SharedTripPage() {

  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [accessType, setAccessType] = useState("");
  const canEdit = accessType === "EDIT";
  const [checklistText, setChecklistText] = useState("");

  const [showChecklistInput, setShowChecklistInput] = useState(false);
  const [editingChecklistId, setEditingChecklistId] = useState(null);
  const [editingChecklistText, setEditingChecklistText] = useState("");

  const getSharedTrip = async () => {
    try {
      const response =
        await axios.get(
          `https://localhost:7215/api/Share/${token}`
        );
      setTrip(
        response.data.trip
      );

      setAccessType(
        response.data.accessType
      );

    } catch (error) {

      console.log(error);
    }
  };

  const createChecklistItem = async () => {
    try {
        await axios.post(
        "https://localhost:7215/api/Checklist",
        {
            tripId: trip.id,
            text: checklistText
        }
        );

        setChecklistText("");
        getSharedTrip();

        } catch (error) {
            console.log(error);
        }
    };

    const updateChecklistItem = async (itemId) => {
        try {
            await axios.put(
            `https://localhost:7215/api/Checklist/${itemId}`,
            {
                text: editingChecklistText
            }
            );
            setEditingChecklistId(null);
            setEditingChecklistText("");
            getSharedTrip();
        } catch (error) {
            console.log(error);
        }
    };

  const groupedActivities = trip?.activities?.reduce((groups, activity) => {
      const date = activity.date.slice(0,10);

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(activity);

      return groups;

        },
        {}
    );


  useEffect(() => {
    getSharedTrip();
  }, []);

  if (!trip) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="app">
      <div className="container">

        <h1 className="title">
          ✈️ {trip.title}
        </h1>
        <h2>
          Access:{" "} {accessType}
        </h2>

        <div className="overview-section">
            <div className="trip-card trip-summary">

                <p>{trip.description}</p>
                <p>Budget: {trip.budget}</p>
                <p className="date-text">
                📅 {trip.startDate.slice(0,10)}
                {" → "}
                {trip.endDate.slice(0,10)}
                </p>

            </div>

            <div className="trip-card checklist-container">

                <h2 className="checklist-title">
                📝 Reminder List
                </h2>

                {trip.checklistItems?.map((item) => (
                <label
                    key={item.id}
                    className="checklist-item">
                    <input
                    type="checkbox"
                    checked={item.completed}
                    disabled/>

                    <span>{item.text}</span>
                </label>
            ))}

            {canEdit && (<div className="shared-add-wrapper">
                {!showChecklistInput ? (

                <span
                    className="add-checklist-btn"
                    onClick={() =>
                    setShowChecklistInput(true)}>
                    ➕
                </span>

                ) : (

                <div className="shared-edit-section">
                    <input
                        type="text"
                        placeholder="New reminder"
                        value={checklistText}
                        onChange={(e) => setChecklistText(e.target.value)}/>

                    <div className="shared-buttons">
                        <button
                            className="small-add-btn"
                            onClick={async () => {

                            await createChecklistItem();

                            setShowChecklistInput(
                                false
                            );
                            }}>
                            Add
                        </button>

                        <button
                            className="small-cancel-btn"
                            onClick={() => {

                            setShowChecklistInput(
                                false
                            );
                            setChecklistText("");
                            }}>✕
                        </button>

                    </div>

                </div>
                )}

        </div>
        )}

    </div>

        <div className="trip-card notes-card">

            <h2 className="checklist-title">
                📝 Activity Notes
            </h2>
            
            {trip.activities?.filter((x) => x.notes).map((activity) => (
                <p key={activity.id}>

                <strong>
                    {activity.title}
                </strong>

                {" : "}

                {activity.notes}

                </p>               
            ))}
        </div>
    </div>
        

        <h2 className="section-title">
          Destinations
        </h2>

        <div className="trip-grid">
          {trip.destinations.map(
            (destination) => (

            <div
              key={destination.id}
              className="trip-card">
              <h3>
                📍 {destination.name}
              </h3>

              <p>
                {destination.location}
              </p>

              <p>
                {destination.description}
              </p>
            </div>
          ))}
        </div>

        <h2 className="section-title">
          Activities
        </h2>

        {Object.entries(groupedActivities).map(([date, activities]) => (

        <div key={date}>

            <h3 className="activity-date-heading">
            🗓️ {
                new Date(date)
                .toLocaleDateString(
                    "en-US",
                    { weekday: "long" }
                )}
            {" • "}
            {date}
            </h3>

            <div className="activities-grid">
            {activities.map((activity) => (

                <div
                key={activity.id}
                className="trip-card activity-card">

                <h3>
                    {activity.title}
                </h3>

                <p>
                    🕒 {activity.time}
                </p>

                <p>
                    {activity.location}
                </p>

                <p>
                    {activity.description}
                </p>

                <p>
                    Cost:
                    {" "}
                    {activity.estimatedCost}
                </p>

            </div>
        ))}

        </div>
  </div>
))}



      </div>
    </div>
  );
}

export default SharedTripPage;