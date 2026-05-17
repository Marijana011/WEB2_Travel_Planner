import { use, useEffect, useState }from "react";
import axios from "axios";
import "../App.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function AdminPage() {

  const [trips, setTrips] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTrips, setSelectedTrips] = useState([]);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

  const navigate = useNavigate();
  
  const getAllTrips = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        "https://localhost:7215/api/Trip/all",
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
    );
    setTrips(response.data);
  };

  const getUsers = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        "https://localhost:7023/api/Auth/users",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    setUsers(response.data);
  };

  const getUserTrips = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `https://localhost:7215/api/Trip/user/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  setSelectedTrips(response.data);
};

  useEffect(() => {
    getAllTrips();
    getUsers();
  }, []);

  return (
    <div className="app">
      <div className="container">

        <h1 className="title">👑 Admin Panel</h1>

        <div className="admin-users">
            {users.filter((user) => user.role !== "Admin" && user.email !== email).map((user) => (
                <div key={user.id} className="trip-card admin-user-card"> 
                    <h3>👤{user.name}</h3>
                    <p>{user.email}</p>

                    <button onClick={() => navigate(`/dashboard/${user.id}?admin=true`, {
                        state: { viewedUserName: user.name},
                    })}>View Trips</button>
                </div>
            ))}
        </div>
    </div>
</div>
  );
}

export default AdminPage;