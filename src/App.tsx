import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import './App.css';
import {
  Home,
  Login,
  Register,
  Event,
} from './pages';
import BaseRouteGuard from "./components/BaseRouteGuard";

function App() {
  return (
    <Router basename="ui">
      <BaseRouteGuard>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Event />} />
          <Route path="/test" element={<Register />} />
        </Routes>

        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#fff",
              color: "#333",
              fontWeight: "initial"
            },
          }}
        />
      </BaseRouteGuard>
    </Router>
  )
}

export default App;
