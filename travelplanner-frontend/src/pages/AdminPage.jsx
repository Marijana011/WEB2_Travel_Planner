import { use, useEffect, useState }from "react";
import axios from "axios";
import "../App.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function AdminPage() {

  const [trips, setTrips] = useState([]);
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  
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

  useEffect(() => {
    getAllTrips();
    getUsers();
  }, []);

  return (
  <div className="app">

    <div className="container">

      <h1 className="title">
        👑 System Administration
      </h1>

      <div className="admin-stats">

        <div className="stat-card">
          <h3>👥 Users</h3>
          <p>{users.filter(u => u.role !== "Admin").length}</p>
        </div>

        <div className="stat-card">
          <h3>🧳 Trips</h3>
          <p>{trips.length}</p>
        </div>

        <div className="stat-card">
          <h3>👑 Admin</h3>
          <p>Online</p>
        </div>

      </div>

      <div className="admin-search">

        <input
          type="text"
          placeholder="🔍 Search users..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }/>

      </div>

      <h2 className="section-title">
        User Management
      </h2>

      <div className="admin-users">
        {users
          .filter(
            (user) =>
              user.role !== "Admin" &&
              user.email !== email &&
              (
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
              )).map((user) => (
            <div
              key={user.id}
              className="trip-card admin-user-card">

              <h3>👤 {user.name}</h3>

              <p>{user.email}</p>

              <button
                onClick={() =>
                  navigate(
                    `/dashboard/${user.id}?admin=true`,
                    {
                      state: {
                        viewedUserName: user.name,
                      },
                    }
                  )}>
                View Trips
              </button>
            </div>
          ))}
      </div>
    </div>
  </div>
);
}

export default AdminPage;