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

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<BaseRouteGuard> <Event /> </BaseRouteGuard>} />
        <Route path="/test" element={<BaseRouteGuard> <Register /> </BaseRouteGuard>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
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
    </Router >
  )
}

export default App;
