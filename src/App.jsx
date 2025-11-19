import { useRoutes } from "react-router-dom";
import "./App.css";

// ===== Public =====
import Solar from "./Components/Solar_on_Board.jsx/Solar";
import Login from "./Components/Login";

// ===== Admin / Dashboard =====
import Dashboard from "./Components/Dashboard";
import AdminLayout from "./Components/AdminLayout";
import Edit from "./Components/Edit";
import ManageCoordinators from "./Components/ManageCoordinators";

// ===== District Coordinator =====
import DistrictLayout from "./Components/DistrictLayout";
import Districtdash from "./Components/Distrcictdash";

// ===== 404 Not Found =====
import NotFound from "./Components/not-found"; // ✅ updated import
import DistrictStats from "./Components/DistrictStats";
import DistrictDashboard from "./Components/DistrictDashboard";
import Demo from './Components/Demo'

function App() {
  const routes = useRoutes([
    // ============================
    // 🔹 PUBLIC ROUTES
    // ============================
      { path: "/", element: < Demo/> },
    { path: "/registration", element: <Solar /> },
    { path: "/login", element: <Login /> },

    // ============================
    // 🔹 ADMIN (public for v1)
    // ============================
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { index: true, element: <DistrictStats /> },
        { path: "records", element: <Edit /> },
        {path:"aprove",element: <Dashboard/>},
        { path: "manage-cordinator", element: <ManageCoordinators /> },
      ],
    },

    // ============================
    // 🔹 DISTRICT COORDINATOR (public for v1)
    // ============================
    {
      path: "/district-cordinator",
      element: <DistrictLayout />,
      children: [{ index: true, element: <DistrictDashboard /> },

{path:"aprovals",element:<Districtdash/>}

      ],
    },

    // ============================
    // 🔹 404 FALLBACK
    // ============================
    {
      path: "*",
      element: <NotFound />, // ✅ clean and correct
    },
  ]);

  return <>{routes}</>;
}

export default App;
