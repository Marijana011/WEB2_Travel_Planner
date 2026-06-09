import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../App.css";
import CalendarView from "./CalendarView";

function SharedTripPage() {

  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [accessType, setAccessType] = useState("");
  const canEdit = accessType === "EDIT";
  const [checklistText, setChecklistText] = useState("");

  const [showChecklistInput, setShowChecklistInput] = useState(false);
  const [notFound, setNotFound] = useState(false);


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

      if(error.response?.status === 404){
        setNotFound(true);
      }
    }
  };

  const createChecklistItem = async () => {
    try {
        await axios.post(
        `https://localhost:7215/api/Share/${token}/checklist`,
        {
          text: checklistText,
          completed: false
        }
      );

        setChecklistText("");
        getSharedTrip();

        } catch (error) {
            console.log(error);
            console.log(error.response?.data);
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

    if(notFound){
      return (
        <div className="app">
          <h1>Trip no longer exists.</h1>
        </div>
      )
    }

    return <h1>Loading...</h1>;
  }

  const totalSpent = trip.activities.reduce(
    (sum, activity) => sum + activity.estimatedCost, 0);

const remainingBudget =
  trip.budget - totalSpent;

  return (
    <div className="app">
      <div className="container">

        <h1 className="title">
          ✈️ {trip.title}
        </h1>
        <h2 className="shared-access">
          🔗 Shared Access: {accessType}
        </h2>

        <div className="overview-section">
            <div className="trip-card trip-summary">

                <p>{trip.description}</p>

                📅 {
                  new Date(trip.startDate)
                    .toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short"
                      }
                    )
                }
                {" — "}
                {
                  new Date(trip.endDate)
                    .toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short"
                      }
                    )
                }

                <div className="budget-summary">
                  <div className="remaining-budget">
                    🏖️ {remainingBudget}
                    <span>
                      left to spend
                    </span>
                  </div>

                  <div className="budget-pill">
                    💳 Budget: {trip.budget}
                  </div>

                  <div className="budget-pill">
                    💵 Spent: {totalSpent}
                  </div>
                </div>
                
            </div>

            <div className="trip-card checklist-container notes-container">

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

                <button
                    className="mini-add-btn"
                    onClick={() =>
                    setShowChecklistInput(true)}>
                    +
                </button>

                ) : (
                    <>
                    <input
                        type="text"
                        placeholder="New reminder"
                        value={checklistText}
                        onChange={(e) => setChecklistText(e.target.value)}
                        className="mini-note-input"/>

                        <button
                            className="mini-add-btn"
                            onClick={async () => {

                            if (!checklistText.trim()) {
                              setShowChecklistInput(false);
                              return;
                            }

                            await createChecklistItem();

                            setChecklistText("");
                            setShowChecklistInput(false);
                            }}>
                            ✓
                        </button>                
                  </>
                )}
               
        </div>
        )}
      
    </div>

    <div className="trip-card notes-container">

          <h2 className="checklist-title">
                📝 Activity Notes
          </h2>
            
            {trip.activities ?.filter((x) => x.notes)
            .map((activity) => (
              <div
                key={activity.id}
                className="note-item">
                <strong>
                  {activity.title}
                </strong>

                {" : "}

                {activity.notes}
              </div>
          ))}
        </div>

      <CalendarView activities={trip.activities}/>
        
    </div>
        

        <h2 className="section-title">
          Destinations
        </h2>

        <div className="trip-grid">
          {trip.destinations.map(
            (destination) => (
            <div
              key={destination.id}
              className="trip-card destination-card">
              <h3>
                📍 {destination.name}
              </h3>

              <p>{destination.location}</p>
              <p> {destination.description}</p>
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