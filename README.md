# Training Tracker

A full-stack training tracking application that allows users to log workouts and monitor their progress over time.

---

## Demo Video

You can watch the demo presentation of the application here:

https://drive.google.com/file/d/126TargKn2GhG5BeyaDPyHF6xSFpVHKyB/view?usp=sharing

---

## Tech Stack

- **Backend:** ASP.NET Core Web API, Entity Framework Core, SQL Server
- **Authentication:** JWT + Refresh Token
- **Frontend:** Angular
- **API Documentation:** Swagger

---

## Repository Structure

- `/backend`  → .NET solution (API + Core + Infrastructure)
- `/frontend` → Angular application
- `/docs`     → Documentation and demo notes

---

## Features

- User Registration / Login (JWT + Refresh Token authentication)
- Workout logging with:
  - Type of workout
  - Duration (minutes)
  - Calories burned
  - Intensity (1–10 scale)
  - Fatigue (1–10 scale)
  - Notes
  - Date & time
- Monthly progress tracking:
  - Weekly grouped statistics
  - Total duration per week
  - Workout count per week
  - Average intensity
  - Average fatigue

---

## Getting Started

### Prerequisites

- .NET SDK 8.0 or higher
- Node.js 18+ and npm
- SQL Server (LocalDB or SQL Server Express)

### Backend Setup

1. **Configure Database Connection**
   
   Edit `backend/TrainingTracker.Api/TrainingTracker.Api/appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=TrainingTrackerDb;Trusted_Connection=True;TrustServerCertificate=True;"
   }
   ```

2. **Run Backend**
   ```bash
   cd backend/TrainingTracker.Api/TrainingTracker.Api
   dotnet run
   ```
   
   The API will start on:
   - HTTPS: https://localhost:7035
   - HTTP: http://localhost:5220
   - Swagger: https://localhost:7035/swagger

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend/training-tracker-ui
   npm install
   ```

2. **Verify API URL**
   
   Check `src/environments/enviroment.ts`:
   ```typescript
   export const environment = {
     apiUrl: 'https://localhost:7035'
   };
   ```

3. **Run Frontend**
   ```bash
   npm start
   ```
   
   The application will open at: http://localhost:4200

### Notes

- The database will be created automatically on first run (EF Core migrations)
- You need to register a new user account to start using the application
- JWT tokens are used for authentication with automatic refresh token handling

