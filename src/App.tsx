import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import './App.css';
import {
  Home,
  LoginScreen,
  RegisterScreen
} from './pages';

function App() {
  return (
    <Router basename="ui">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
      </Routes>

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            fontWeight:"initial"
          },
        }}
      />
    </Router>
  )
}

export default App;
