# Employee Management System
> ASP.NET Web API + React TypeScript + MySQL

## Prerequisites (Install these first)

| Tool | Version | Download |
|------|---------|---------|
| .NET SDK | 8.0+ | https://dotnet.microsoft.com/download |
| Node.js | 18+ | https://nodejs.org |
| MySQL | 8.0+ | https://dev.mysql.com/downloads/mysql/ |

---

## Step-by-Step Setup

### Step 1 — Setup MySQL

1. Open **MySQL Workbench** or **MySQL Shell**
2. Run this SQL to create the database:
   ```sql
   CREATE DATABASE employee_db;
   ```
3. Note your MySQL **root password**

---

### Step 2 — Configure the Backend

1. Open: `backend/EmployeeAPI/appsettings.json`
2. Find this line and replace `YOUR_MYSQL_PASSWORD` with your actual MySQL password:
   ```json
   "DefaultConnection": "Server=localhost;Port=3306;Database=employee_db;User=root;Password=YOUR_MYSQL_PASSWORD;"
   ```

---

### Step 3 — Run the Backend (ASP.NET API)

Open a terminal in the `backend/EmployeeAPI/` folder and run:

```bash
# Restore packages
dotnet restore

# Apply database migrations (creates all tables automatically)
dotnet ef database update

# Start the API
dotnet run
```

✅ API will be running at: **http://localhost:5000**  
✅ Swagger docs at: **http://localhost:5000/swagger**

> If `dotnet ef` is not found, install it with:
> ```bash
> dotnet tool install --global dotnet-ef
> ```

---

### Step 4 — Run the Frontend (React)

Open a **new terminal** in the `frontend/` folder and run:

```bash
# Install packages (first time only)
npm install

# Start the frontend
npm run dev
```

✅ Frontend will be running at: **http://localhost:5173**

---

## Login

Open **http://localhost:5173** in your browser.

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `Admin@123` |

---

## Features

- **Login** — JWT-based secure authentication
- **Dashboard** — Stats cards + department charts (pie & bar)
- **Employees** — Add / Edit / Delete / Bulk Delete / View / Search / Filter
- **Attendance** — Record daily attendance with check-in/out
- **Reports** — Download Employee Directory as PDF or Excel, Attendance as Excel

---

## Project Structure

```
EmployeeManagementSystem/
├── backend/
│   └── EmployeeAPI/
│       ├── Controllers/      ← Auth, Employees, Attendance, Reports
│       ├── Models/           ← Employee, Attendance, User
│       ├── Data/             ← EF Core DbContext
│       ├── DTOs/             ← Request/response DTOs
│       ├── appsettings.json  ← DB connection + JWT config
│       └── Program.cs        ← App startup
└── frontend/
    └── src/
        ├── pages/            ← Login, Dashboard, Employees, Attendance, Reports
        ├── components/       ← Sidebar, Layout, EmployeeModal
        ├── services/         ← Axios API client
        ├── hooks/            ← Auth context
        └── types/            ← TypeScript interfaces
```

---

## Troubleshooting

**"Cannot connect to MySQL"** → Check password in `appsettings.json`, make sure MySQL service is running

**"Port 5000 already in use"** → Change `"Urls": "http://localhost:5001"` in `appsettings.json`, and update `vite.config.ts` proxy target

**"npm install fails"** → Make sure Node.js 18+ is installed: `node --version`

**"dotnet run fails"** → Make sure .NET 8 SDK is installed: `dotnet --version`
