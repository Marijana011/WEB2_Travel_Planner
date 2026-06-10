# Travel Planner

## Description

Travel Planner is a web application for planning and organizing trips.

The application allows users to:

- Create and manage trips
- Add destinations and activities
- Track trip budget
- Manage reminder lists
- Generate PDF reports
- Share trips with VIEW or EDIT access
- Administrators can view users and their trips

---

## Technologies

### Frontend

- React
- React Router
- Axios
- React Toastify

### Backend

- ASP.NET Core Web API
- Entity Framework Core
- JWT Authentication

### Database

- SQL Server

---

## Project Structure

```
TravelPlanner
│
├── AuthService
├── TravelService
├── BudgetService
├── travelplanner-frontend
└── README.md
```

---

## Prerequisites

Install:

- .NET 8 SDK
- Node.js
- SQL Server Express
- Visual Studio 2022

---

## Database Setup

Connection string example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=TravelPlannerDb;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

Apply migrations:

```powershell
Update-Database
```

---

## Running Backend Services

Open each service in Visual Studio and run:

### AuthService

Default URL:

```
https://localhost:7023
```

### TravelService

Default URL:

```
https://localhost:7215
```

### BudgetService

Default URL:

```
https://localhost:7286
```

---

## Running Frontend

Open terminal:

```bash
cd travelplanner-frontend
npm install
npm run dev
```

Frontend URL:

```
http://localhost:5173
```

---

## Features

### User Features

- Register
- Login
- Create trip
- Edit trip
- Delete trip
- Manage destinations
- Manage activities
- Manage reminders
- Budget tracking
- PDF export
- Share trip (VIEW / EDIT)

### Admin Features

- View users
- View user trips
- Manage content

---

## Sharing System

Users can generate shareable links with two access levels:

### VIEW

The shared user can only view trip information.

### EDIT

The shared user can modify allowed trip data.

---

## Author

Marijana Kolarov
Faculty of Technical Sciences