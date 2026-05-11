import { useState } from 'react'
import axios from 'axios';

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [trips, setTrips] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");

  const login = async () => {
    try{
      const response = await axios.post(
        "https://localhost:7023/api/Auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);

      alert("Login successful!");
    }catch(error){
      console.log(error);

      alert("Login failed.");
    }
  };

  const getTrips = async () => {
    try{
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
    }catch(error){
      console.log(error);
    }
  };

  const createTrip = async () => {
    try{
      const token = localStorage.getItem("token");

      await axios.post(
        "https://localhost:7215/api/Trip",
        {
          title,
          description,
          startDate: "2026-06-01",
          endDate: "2026-06-10",
          budget: Number(budget),
          notes: "Created from React"
        },
        {
          headers:{
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      alert("Trip created!");

      getTrips();
    }catch(error){
      console.log(error);
    }
  };


  return (
    <div 
      style={{ 
        padding: "40px", 
        fontFamily: "Arial",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "300px"
        }}>

      <h1>Travel Planner</h1>

      <input
        type= "email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}>
      </input>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}>
      </input>

      <input
          type="text"
          placeholder="Trip title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}>
      </input>

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}>
      </input>

      <input
        type="number"
        placeholder="Budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}>
      </input>

      <button onClick={createTrip}>Create Trip</button>

      <button onClick={login}>Login</button>    

      <button onClick={getTrips}>Load Trips</button>

      {trips.map((trip) => (
        <div
          key={trip.id}
          style={{
          border: "1px solid gray",
          padding: "10px",
          marginTop: "10px",
        }} >
       
        <h3>{trip.title}</h3>

        <p>{trip.description}</p>

        <p>Budget: {trip.budget}</p>
       
      </div>
    ))}
    </div>
  );}
  
export default App;
