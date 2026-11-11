import "./App.css";
import { useState, useEffect } from "react";
import { Link, useRoutes } from "react-router";
import ReadTrips from "./pages/ReadTrips";
import CreateTrip from "./pages/CreateTrip";
import EditTrip from "./pages/EditTrip";
import CreateDestination from "./pages/CreateDestination";
import ReadDestinations from "./pages/ReadDestinations";
import TripDetails from "./pages/TripDetails";
import CreateActivity from "./pages/CreateActivity";
import AddToTrip from "./pages/AddToTrip";
import Login from "./pages/Login";
import Avatar from "./components/Avatar";

const App = () => {
  const API_URL = "http://localhost:3001";
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/login/success`, {
          credentials: "include",
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const json = await response.json();
        setUser(json.user ?? null);
      } catch (error) {
        console.error("Unable to retrieve authenticated user:", error);
        setUser(null);
      }
    };

    const fetchTrips = async () => {
      const response = await fetch(`${API_URL}/api/trips`);
      const data = await response.json();
      setTrips(data);
    };

    const fetchDestinations = async () => {
      const response = await fetch(`${API_URL}/api/destinations`);
      const data = await response.json();
      setDestinations(data);
    };

    getUser();
    fetchTrips();
    fetchDestinations();
  }, []);

  // Sets up logout functionality
  const logout = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Logout failed: HTTP ${response.status}`);
      }

      await response.json();

      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Sets up routes
  let element = useRoutes([
    {
      path: "/",
      element:
        user && user.id ? (
          <ReadTrips user={user} data={trips} />
        ) : (
          <Login api_url={API_URL} />
        ),
    },
    {
      path: "/trip/new",
      element:
        user && user.id ? (
          <CreateTrip user={user} api_url={API_URL} />
        ) : (
          <Login api_url={API_URL} />
        ),
    },
    {
      path: "/edit/:id",
      element:
        user && user.id ? (
          <EditTrip user={user} data={trips} api_url={API_URL} />
        ) : (
          <Login api_url={API_URL} />
        ),
    },
    {
      path: "/destinations",
      element:
        user && user.id ? (
          <ReadDestinations user={user} data={destinations} />
        ) : (
          <Login api_url={API_URL} />
        ),
    },
    {
      path: "/trip/get/:id",
      element:
        user && user.id ? (
          <TripDetails user={user} data={trips} api_url={API_URL} />
        ) : (
          <Login api_url={API_URL} />
        ),
    },
    {
      path: "/destination/new",
      element:
        user && user.id ? (
          <CreateDestination user={user} api_url={API_URL} />
        ) : (
          <Login api_url={API_URL} />
        ),
    },
    {
      path: "/activity/create/:trip_id",
      element:
        user && user.id ? (
          <CreateActivity user={user} api_url={API_URL} />
        ) : (
          <Login api_url={API_URL} />
        ),
    },
    {
      path: "/destinations/add/:destination_id",
      element:
        user && user.id ? (
          <AddToTrip user={user} data={trips} api_url={API_URL} />
        ) : (
          <Login api_url={API_URL} />
        ),
    },
  ]);

  return (
    <div className="App">
      {user && user.id ? (
        <div className="header">
          <h1>On The Fly ✈️</h1>

          <div className="headerNav">
            <Link to="/">
              <button className="headerBtn">Explore Trips</button>
            </Link>

            <Link to="/destinations">
              <button className="headerBtn">Explore Destinations</button>
            </Link>

            <Link to="/trip/new">
              <button className="headerBtn">+ Add Trip</button>
            </Link>

            <Link to="/destination/new">
              <button className="headerBtn">+ Add Destination</button>
            </Link>

            <div className="headerAccount">
              <Avatar className="avatar" user={user} />

              <button onClick={logout} className="headerBtn">
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {element}
    </div>
  );
};

export default App;
