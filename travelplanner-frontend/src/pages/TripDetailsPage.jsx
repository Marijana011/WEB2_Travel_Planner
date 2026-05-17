import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../App.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";

function TripDetailsPage() {
  const [shareLink, setShareLink] = useState("");
  const [shareAccess, setShareAccess] = useState("VIEW");

  const { id } = useParams();
  const { userId } = useParams();

  const [trip, setTrip] = useState(null);
  const [destinationName, setDestinationName] = useState("");
  const [location, setLocation] = useState("");
  const [destinationDescription, setDestinationDescription] = useState("");
  const [editingDestinationId, setEditingDestinationId] = useState(null);
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");

  const [activityTitle, setActivityTitle] = useState("");
  const [activityLocation, setActivityLocation] = useState("");  
  const [activityDescription, setActivityDescription] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [notes, setNotes] = useState("");
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [activityDate, setActivityDate] = useState("");
  const [activityTime, setActivityTime] = useState("");
  const [category, setCategory] = useState("Other");

  const [checklistItem, setChecklistItem] = useState("");
  const [checklist, setChecklist] = useState([]);

  const [status, setStatus] = useState("Planned");

  const destinationFormRef = useRef(null);
  const activityFormRef = useRef(null);

  const navigate = useNavigate();

  const createShareLink = async () => {
  try {
    const response =
      await axios.post(
        `https://localhost:7215/api/Share/create?tripId=${id}&accessType=${shareAccess}`
      );

    setShareLink(
      response.data.link
    );
    toast.success(
      "Share link created!"
    );
  } catch (error) {

    console.log(error);

    toast.error(
      "Failed to create share link."
    );
  }
};


const generatePdf = () => {

  const doc = new jsPDF();

  doc.setFontSize(22);

  doc.text(
    trip.title,
    20,
    20
  );

  doc.setFontSize(14);

  doc.text(
    trip.description,
    20,
    35
  );

  doc.text(
    `Budget: ${trip.budget}`,
    20,
    50
  );

  doc.text(
    `Dates: ${
      trip.startDate.slice(0,10)
    } - ${
      trip.endDate.slice(0,10)
    }`,
    20,
    60
  );

  let y = 80;

  doc.setFontSize(18);

  doc.text(
    "Destinations",
    20,
    y
  );

  y += 10;

  trip.destinations.forEach(
    (destination) => {

    doc.setFontSize(12);

    doc.text(
      `• ${destination.name}
       - ${destination.location}`,
      20,
      y
    );

    y += 10;
  });

  y += 10;

  doc.setFontSize(18);

  doc.text(
    "Activities",
    20,
    y
  );

  y += 10;

  trip.activities.forEach(
    (activity) => {

    doc.setFontSize(12);

    doc.text(
      `• ${activity.title}
       (${activity.time})`,
      20,
      y
    );

    y += 10;
  });

  doc.save(
    `${trip.title}.pdf`
  );
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
        if(!destinationName || !location || !destinationDescription || !arrivalDate || !departureDate){
          toast.error("Please fill all fields.");

          return;
        }

        const token = localStorage.getItem("token");

        const tripStart = new Date(trip.startDate);
        const tripEnd = new Date(trip.endDate);
        const arrival = new Date(arrivalDate);
        const departure = new Date(departureDate);

        if(arrival < tripStart || departure > tripEnd) {
          toast.error("Destination dates must be within trip dates.");
        
          return;
        }
        
        if (departure < arrival) {
          toast.error(
            "Departure date cannot be before arrival date."
          );

          return;
        }

        await axios.post(
            "https://localhost:7215/api/Destination",
            {
                name: destinationName,
                location: location,
                arrivalDate,
                departureDate,
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
        setArrivalDate("");
        setDepartureDate("");
        toast.success("Destination added!");

        getTrip();
        }catch(error){
            console.log(error);
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

const startEditDestination = (destination) => {
  setEditingDestinationId(destination.id);
  setDestinationName(destination.name);
  setLocation(destination.location);
  setDestinationDescription(destination.description);
  setArrivalDate(destination.arrivalDate.slice(0, 10));
  setDepartureDate(destination.departureDate.slice(0, 10));

  destinationFormRef.current?.scrollIntoView({
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
        arrivalDate,
        departureDate,
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
    setArrivalDate("");
    setDepartureDate("");
    toast.success("Destination updated!");

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
  setArrivalDate("");
  setDepartureDate("");
};

const createActivity = async () => {
        try{
            if(!activityTitle || !activityLocation || !activityDescription || !activityDate || !activityTime || !notes){
              toast.error("Please fill all fields.");

              return;
            }

            const token = localStorage.getItem("token");

            const tripStart = new Date(trip.startDate);
            const tripEnd = new Date(trip.endDate);
            const activityDay = new Date(activityDate);

            if (
              activityDay < tripStart ||
              activityDay > tripEnd
            ) {
              toast.error(
                "Activity date must be within trip dates."
              );

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
            setActivityTitle("");
            setActivityLocation("");
            setActivityDescription("");
            setEstimatedCost("");
            setActivityDate("");
            setActivityTime("");
            setNotes("");
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

const updateActivity = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `https://localhost:7215/api/Activity/${editingActivityId}`,
      {
        id: editingActivityId,
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

    setEditingActivityId(null);
    setActivityTitle("");
    setActivityLocation("");
    setActivityDescription("");
    setEstimatedCost("");
    setActivityDate("");
    setActivityTime("");
    setNotes("");
    toast.success("Activity updated!");

    getTrip();
  } catch (error) {
    console.log(error);
  }
};

const startEditActivity = (activity) => {
  setEditingActivityId(activity.id);
  setActivityTitle(activity.title);
  setActivityLocation(activity.location);
  setActivityDescription(activity.description);
  setEstimatedCost(activity.estimatedCost);
  setActivityDate(activity.date.slice(0, 10));
  setActivityTime(activity.time);
  setNotes(activity.notes);

  activityFormRef.current?.scrollIntoView({
  behavior: "smooth",
  });
};

const cancelActivityEdit = () => {
  setEditingActivityId(null);
  setActivityTitle("");
  setActivityLocation("");
  setActivityDescription("");
  setEstimatedCost("");
  setActivityDate("");
  setActivityTime("");
  setNotes("");
};


const addChecklistItem = async () => {
      if (!checklistItem) {
        return;
      }
      const token = localStorage.getItem("token");
      await axios.post(
        "https://localhost:7215/api/Checklist",
        {
          text: checklistItem,
          tripId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChecklistItem("");
      getChecklist();
    };

    const getChecklist = async () => {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `https://localhost:7215/api/Checklist/trip/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setChecklist(response.data);
  };

const toggleChecklistItem = async (id) => {
  const token = localStorage.getItem("token");
  await axios.put(
    `https://localhost:7215/api/Checklist/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  getChecklist();
};

  useEffect(() => {
    getTrip();
    getChecklist();
  }, []);

  if (!trip) {
    return <h1>Loading...</h1>;
  }

  const groupActivities = trip.activities.reduce(
  (groups, activity) => {
    const date = activity.date.slice(0,10);

    if(!groups[date]){
      groups[date] = [];
    }

    groups[date].push(activity);
    return groups;
  },
  {}
);

const token = localStorage.getItem("token");
const decoded = jwtDecode(token);
const role = decoded[
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
const isAdminView = role === "Admin" && window.location.search.includes("admin=true");

const totalSpent = trip.activities.reduce((sum, activity) =>sum + activity.estimatedCost, 0);
const remainingBudget = trip.budget - totalSpent;

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">✈️ {trip.title}</h1>
        <div className="overview-section">
          <div className="trip-card trip-summary">
          
            <p>{trip.description}</p>
            <p>Budget: {trip.budget}</p>
            <p>💸 Spent: {totalSpent}</p>
            <p>💰 Remaining: {remainingBudget}</p>
            <p className="date-text">
              📅 {trip.startDate.slice(0, 10)} → {" "}
              {trip.endDate.slice(0, 10)}</p>
            {!isAdminView && (
            <>
            <div className="share-inline">
              <select
                value={shareAccess}
                onChange={(e) =>
                  setShareAccess(e.target.value)}>
                <option value="VIEW">
                  VIEW
                </option>

                <option value="EDIT">
                  EDIT
                </option>
              </select>
            <span
              className="share-link-btn"
              onClick={createShareLink}>
              📱 Scan QR code 
            </span>
          </div>

          {shareLink && (
            <>           
            <div className="qr-wrapper">
              <QRCodeCanvas value={shareLink} size={120}/>
            </div>
            <a
              href={shareLink}
              target="_blank"
              rel="noreferrer"
              className="open-shared-btn"
            >
              Open Shared Trip
            </a>

            <button
              className="cancel-qr-btn"
              onClick={() =>
                setShareLink("")}>
              ✕ Close
            </button>
          </>
          )}
      </>
      )}
      </div>
         
        <div className="trip-card checklist-container">
          <h2 className="checklist-title">📝 Reminder List</h2>
          {checklist.map((item) => (
            <label
              key={item.id}
              className="checklist-item">              
              <input
                type="checkbox"
                checked={item.completed}
                disabled={isAdminView}
                onChange={() =>
                  toggleChecklistItem(item.id)}/>
              <span>{item.text}</span>
            </label>
          ))}
        </div>

        <div className="trip-card notes-container">
          <h2 className="checklist-title">📝 Activity Notes</h2>
          {trip.activities.filter((a) => a.notes).map((activity) => (
            <div key={activity.id} className="note-item">
              <p><strong>{activity.title}</strong> : {activity.notes}</p>
            </div>
          ))}
        </div>
      </div>
    
        <h2 className="section-title">Destinations</h2>
        <div className="trip-grid">
          {trip.destinations.map((destination) => (
            <div key={destination.id} className="trip-card trip-summary">
              <h3><span className="emoji">📍</span> {destination.name}</h3>

              <p>{destination.location}</p>
              <p>{destination.description}</p>
              <p className="date-text">
                  📅 {destination.arrivalDate.slice(0, 10)} →{" "}
                  {destination.departureDate.slice(0, 10)}
              </p>

              <div className="card-buttons">
                {!isAdminView && (
                  <button
                    className="edit-btn"
                    onClick={() => startEditDestination(destination)}>
                      Edit
                  </button>
                )}
                
                <button
                  className="delete-btn"
                  onClick={() => deleteDestination(destination.id)}>
                    Delete
                </button>
                
              </div>
            </div>
          ))}
        </div>

        <div className="activities-section">   
          <h2 className="section-title">Activities</h2>
          {Object.entries(groupActivities).map(([date, activities]) => (
          <div key={date} >
            <h3 className="activity-date-heading">🗓️ {
                new Date(date).toLocaleDateString("en-US",{ weekday: "long" })
                } • {date}</h3>

            <div className="activities-grid">{activities.sort((a, b) =>
              a.time.localeCompare(b.time)).map((activity) => (
              <div key={activity.id}className="trip-card activity-card">
                
                <h3>{activity.title}</h3>
                <p className="date-text">🕒 {activity.time}</p>
                <p>{activity.location}</p>
                <p>{activity.description}</p>
                <p>Cost: {activity.estimatedCost} {" → "} {activity.category}</p>
                <p>📌 {activity.status}</p>
                <p>📝 {activity.notes}</p>
                
                
                <div className="card-buttons">
                  {!isAdminView && (
                  <button className="edit-btn"
                    onClick={() => startEditActivity(activity)}>
                    Edit
                  </button>
                  )}                  
                  <button className="delete-btn"
                    onClick={() => deleteActivity(activity.id)}>
                    Delete
                  </button>                 
                  </div>
                </div>
                ))}
              
                </div>
              </div>
            ))}
          </div> 

        
        {!isAdminView && (
        <div className="form-section">
          <h2 className="section-title">Packing Checklist</h2>
          <input
            type="text"
            placeholder="Add checklist item"
            value={checklistItem}
            onChange={(e) =>
              setChecklistItem(e.target.value)
            }
          />
          <button onClick={addChecklistItem}>
            Add Item
          </button>
        </div>
        )}
        
        {!isAdminView && (
        <div className="form-section" ref={destinationFormRef}>
          <h2 className="section-title">{editingDestinationId
          ? "Edit Destination" : "Add Destination"}</h2>
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

            <input
              type="date"
              min={trip.startDate.slice(0,10)}
              max={trip.endDate.slice(0,10)}
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
            />

            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />

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
        )}

        
        {!isAdminView && (
        <div className="form-section" ref={activityFormRef}> 
        <h2 className="section-title">{editingActivityId
          ? "Edit Activity" : "Add Activity"}</h2>
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

          <input
            type="date"
            value={activityDate}
            min={trip.startDate.slice(0, 10)}
            max={trip.endDate.slice(0, 10)}
            onChange={(e) => setActivityDate(e.target.value)}
          />

          <input
            type="time"
            value={activityTime}
            onChange={(e) => setActivityTime(e.target.value)}
          />

          <input
            type="text"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Planned">Planned</option>
            <option value="Reserved">Reserved</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Transport">Transport</option>
            <option value="Accommodation">Accommodation</option>
            <option value="Food">Food</option>
            <option value="Tickets">Tickets</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>

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
        )}

        <button className="pdf-btn" onClick={generatePdf}>
          📄 Download PDF</button>

        <div className="back-container">
          <button
            className="back-btn"
            onClick={() => navigate(-1)}>
            ← Back to Dashboard
          </button>
        </div>

        </div>
    </div>
  );
}

export default TripDetailsPage;