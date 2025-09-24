import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import './App.css';
import {
  HomePage,
  LoginPage,
  RegisterPage,
  EventPage,
} from './pages';

import BaseRouteGuard from "./components/BaseRouteGuard";

function App() {
  return (
    <Router basename="ui">

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/events" element={<BaseRouteGuard> <EventPage /> </BaseRouteGuard>} />
        <Route path="/test" element={<BaseRouteGuard> <RegisterPage /> </BaseRouteGuard>} />
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
